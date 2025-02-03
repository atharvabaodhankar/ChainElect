// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    // Owner of the contract
    address public owner;

    // Voter structure
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedTo;
    }

    // Candidate structure
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    // Mapping of voter addresses
    mapping(address => Voter) public voters;

    // Array of candidates
    Candidate[] public candidates;

    // Voting status
    bool public votingStarted;
    bool public votingEnded;

    // Events
    event VoterRegistered(address voter);
    event CandidateAdded(string name);
    event VotingStarted();
    event VotingEnded();
    event Voted(address voter, uint256 candidateId);

    // Constructor: Initialize contract owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to allow only owner to perform certain actions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    // Modifier to ensure voting is active
    modifier votingActive() {
        require(votingStarted && !votingEnded, "Voting is not active.");
        _;
    }

    // Function to add a candidate
    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate({ name: _name, voteCount: 0 }));
        emit CandidateAdded(_name);
    }

    // Function to register a voter
    function registerVoter(address _voter) public onlyOwner {
        require(!voters[_voter].isRegistered, "Voter is already registered.");
        voters[_voter] = Voter({ isRegistered: true, hasVoted: false, votedTo: 0 });
        emit VoterRegistered(_voter);
    }

    // Function to start voting
    function startVoting() public onlyOwner {
        require(!votingStarted, "Voting has already started.");
        votingStarted = true;
        votingEnded = false;
        emit VotingStarted();
    }

    // Function to end voting
    function endVoting() public onlyOwner {
        require(votingStarted, "Voting has not started yet.");
        require(!votingEnded, "Voting has already ended.");
        votingEnded = true;
        emit VotingEnded();
    }

    // Function to cast a vote
    function vote(uint256 _candidateId) public votingActive {
        require(voters[msg.sender].isRegistered, "You are not a registered voter.");
        require(!voters[msg.sender].hasVoted, "You have already voted.");
        require(_candidateId < candidates.length, "Invalid candidate ID.");

        // Record the vote
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedTo = _candidateId;

        // Increment the candidate's vote count
        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }

    // Function to get the winner(s)
    function getWinner() public view returns (string memory winnerName, uint256 winnerVoteCount) {
        require(votingEnded, "Voting has not ended yet.");

        uint256 highestVotes = 0;
        string memory name;

        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > highestVotes) {
                highestVotes = candidates[i].voteCount;
                name = candidates[i].name;
            }
        }

        return (name, highestVotes);
    }

    // Get total number of candidates
    function getCandidatesCount() public view returns (uint256) {
        return candidates.length;
    }
}
