// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    // Owner of the contract
    address public owner;
    
    // Admin addresses mapping
    mapping(address => bool) public admins;
    
    // Array to keep track of all admin addresses
    address[] private adminAddresses;
    
    // Voting duration in seconds (default 1 hour)
    uint256 public votingDuration = 1 hours;

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
    event CandidateRemoved(uint256 candidateId);
    event VotingStarted(uint256 endTime);
    event VotingEnded();
    event Voted(address voter, uint256 candidateId);
    event AdminAdded(address admin);
    event AdminRemoved(address admin);
    event VoterReset(address voter);
    event VotingDurationChanged(uint256 newDuration);

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
    function addAdmin(address _admin) public onlyAdmin {
        require(!admins[_admin], "Address is already an admin");
        admins[_admin] = true;
        adminAddresses.push(_admin);
        emit AdminAdded(_admin);
    }

    // Function to remove an admin
    function removeAdmin(address _admin) public onlyOwner {
        require(_admin != owner, "Cannot remove owner from admins");
        require(admins[_admin], "Address is not an admin");
        admins[_admin] = false;
        
        // Remove from the array
        for (uint i = 0; i < adminAddresses.length; i++) {
            if (adminAddresses[i] == _admin) {
                // Replace with the last element and then pop
                adminAddresses[i] = adminAddresses[adminAddresses.length - 1];
                adminAddresses.pop();
                break;
            }
        }
        
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

    // Function to remove a candidate
    function removeCandidate(uint256 candidateId) public onlyAdmin {
        require(!votingStarted, "Cannot remove candidate after voting has started");
        require(candidateId > 0 && candidateId <= candidatesCount, "Invalid candidate ID");
        
        // If this is the last candidate, simply decrement the count
        if (candidateId == candidatesCount) {
            delete candidates[candidateId];
            candidatesCount--;
            emit CandidateRemoved(candidateId);
            return;
        }
        
        // Move the last candidate to the deleted position
        candidates[candidateId] = candidates[candidatesCount];
        candidates[candidateId].id = candidateId; // Update the moved candidate's ID
        
        // Delete the last candidate
        delete candidates[candidatesCount];
        candidatesCount--;
        emit CandidateRemoved(candidateId);
    }

    // Function to register a voter
    function registerVoter(address _voter) public onlyAdmin {
        require(!voters[_voter].isRegistered, "Voter is already registered");
        voters[_voter] = Voter({ isRegistered: true, hasVoted: false, votedFor: 0 });
        emit VoterRegistered(_voter);
    }

    // Function to set voting duration (in minutes)
    function setVotingDuration(uint256 durationInMinutes) public onlyAdmin {
        require(!votingStarted, "Cannot change duration while voting is active");
        require(durationInMinutes > 0, "Duration must be greater than 0");
        votingDuration = durationInMinutes * 1 minutes;
        emit VotingDurationChanged(votingDuration);
    }

    // Function to start voting
    function startVoting() public onlyAdmin {
        require(!votingStarted, "Voting has already started");
        require(candidatesCount > 0, "No candidates registered");
        votingStarted = true;
        votingEnded = false;
        votingEndTime = block.timestamp + votingDuration;
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
    function resetVotingState() public onlyAdmin {
        votingStarted = false;
        votingEnded = false;
        votingEndTime = 0;

        // Reset all candidate vote counts
        for (uint256 i = 1; i <= candidatesCount; i++) {
            candidates[i].voteCount = 0;
        }

        // The current implementation only resets the admin's own status
        // We need to track all voters' addresses to reset them all
        // This is a limitation of the current design
        // For now, we'll handle individual voter resets using resetVoter function
        
        // Reset this admin's status at minimum
        if (voters[msg.sender].hasVoted) {
            voters[msg.sender].hasVoted = false;
            voters[msg.sender].votedFor = 0;
            emit VoterReset(msg.sender);
        }

        emit VotingEnded();
    }

    // Function to reset a specific voter's status
    function resetVoter(address voterAddress) public onlyAdmin {
        require(voters[voterAddress].hasVoted, "Voter has not voted yet");
        voters[voterAddress].hasVoted = false;
        voters[voterAddress].votedFor = 0;
        emit VoterReset(voterAddress);
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

    // Function to get all admin addresses
    function getAllAdmins() public view returns (address[] memory) {
        // Count active admins
        uint256 activeAdminCount = 0;
        for (uint i = 0; i < adminAddresses.length; i++) {
            if (admins[adminAddresses[i]]) {
                activeAdminCount++;
            }
        }
        
        // Create a new array including the owner
        address[] memory allAdmins = new address[](activeAdminCount + 1);
        
        // Add owner as the first admin
        allAdmins[0] = owner;
        
        // Add other active admins
        uint256 currentIndex = 1;
        for (uint i = 0; i < adminAddresses.length; i++) {
            if (admins[adminAddresses[i]]) {
                allAdmins[currentIndex] = adminAddresses[i];
                currentIndex++;
            }
        }
        
        return allAdmins;
    }
}