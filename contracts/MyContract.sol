// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    // Owner of the contract
    address public owner;
    
    // Admin addresses mapping
    mapping(address => bool) public admins;
    
    // Voting time limit (1 hour in seconds)
   // uint256 public constant VOTING_DURATION = 1 hours;

    // Voting time limit (1 minute in seconds)
    uint256 public constant VOTING_DURATION = 1 minutes;

    uint256 public votingEndTime;

    // Voter structure
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedFor;
    }

    // Candidate structure
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    // Mapping of voter addresses
    mapping(address => Voter) public voters;

    // Mapping of candidates
    mapping(uint256 => Candidate) public candidates;
    uint256 public candidatesCount;

    // Voting status
    bool public votingStarted;
    bool public votingEnded;

    // Events
    event VoterRegistered(address voter);
    event CandidateAdded(string name);
    event VotingStarted(uint256 endTime);
    event VotingEnded();
    event Voted(address voter, uint256 candidateId);
    event AdminAdded(address admin);
    event AdminRemoved(address admin);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner, "Only admin can call this function");
        _;
    }

    modifier votingActive() {
        require(votingStarted && !votingEnded, "Voting is not active");
        require(block.timestamp < votingEndTime, "Voting period has ended");
        _;
    }

    // Constructor: Initialize contract owner and add them as admin
    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
        emit AdminAdded(msg.sender);
    }

    // Function to add an admin
    function addAdmin(address _admin) public onlyOwner {
        require(!admins[_admin], "Address is already an admin");
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }

    // Function to remove an admin
    function removeAdmin(address _admin) public onlyOwner {
        require(_admin != owner, "Cannot remove owner from admins");
        require(admins[_admin], "Address is not an admin");
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }

    // Function to check if an address is an admin
    function isAdmin(address _address) public view returns (bool) {
        return admins[_address] || _address == owner;
    }

    // Function to add a candidate
    function addCandidate(string calldata name) public onlyAdmin {
        require(!votingStarted, "Cannot add candidate after voting has started");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
        emit CandidateAdded(name);
    }

    // Function to register a voter
    function registerVoter(address _voter) public onlyAdmin {
        require(!voters[_voter].isRegistered, "Voter is already registered");
        voters[_voter] = Voter({ isRegistered: true, hasVoted: false, votedFor: 0 });
        emit VoterRegistered(_voter);
    }

    // Function to start voting
    function startVoting() public onlyAdmin {
        require(!votingStarted, "Voting has already started");
        require(candidatesCount > 0, "No candidates registered");
        votingStarted = true;
        votingEnded = false;
        votingEndTime = block.timestamp + VOTING_DURATION;
        emit VotingStarted(votingEndTime);
    }

    // Function to end voting
    function endVoting() public {
        require(votingStarted, "Voting has not started yet");
        require(!votingEnded, "Voting has already ended");
        require(
            msg.sender == owner || 
            admins[msg.sender] || 
            block.timestamp >= votingEndTime, 
            "Only admin can end voting before time limit"
        );
        votingEnded = true;
        emit VotingEnded();
    }

    // Function to cast a vote
    function vote(uint256 candidateId) public votingActive {
        // Remove the registration check
        // require(voters[msg.sender].isRegistered, "Voter is not registered");
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(candidateId > 0 && candidateId <= candidatesCount, "Invalid candidate");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedFor = candidateId;
        candidates[candidateId].voteCount++;

        emit Voted(msg.sender, candidateId);
    }

    // Function to reset voting state
    function resetVotingState() public onlyOwner {
        votingStarted = false;
        votingEnded = false;
        votingEndTime = 0;
        // Reset all candidate vote counts
        for (uint256 i = 1; i <= candidatesCount; i++) {
            candidates[i].voteCount = 0;
        }
        // Reset all voter states
        emit VotingEnded();
    }

    // Function to get the winner
    function getWinner() public view returns (string memory winnerName, uint256 winnerVoteCount) {
        require(votingEnded || block.timestamp >= votingEndTime, "Voting has not ended yet");

        uint256 highestVotes = 0;
        string memory name;

        for (uint256 i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > highestVotes) {
                highestVotes = candidates[i].voteCount;
                name = candidates[i].name;
            }
        }

        return (name, highestVotes);
    }

    // Get total number of candidates
    function getCandidatesCount() public view returns (uint256) {
        return candidatesCount;
    }

    // Function to get candidate details
    function getCandidate(uint256 candidateId) public view returns (string memory, uint256) {
        require(candidateId > 0 && candidateId <= candidatesCount, "Invalid candidate ID");
        Candidate memory candidate = candidates[candidateId];
        return (candidate.name, candidate.voteCount);
    }

    // Function to get remaining voting time
    function getRemainingTime() public view returns (uint256) {
        if (!votingStarted || votingEnded || block.timestamp >= votingEndTime) {
            return 0;
        }
        return votingEndTime - block.timestamp;
    }
}