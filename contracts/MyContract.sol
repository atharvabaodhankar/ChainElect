// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    // Owner of the contract
    address public owner;

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
    function addCandidate(string memory name) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
        emit CandidateAdded(name);
    }

    // Function to register a voter
    function registerVoter(address _voter) public onlyOwner {
        require(!voters[_voter].isRegistered, "Voter is already registered.");
        voters[_voter] = Voter({ isRegistered: true, hasVoted: false, votedFor: 0 });
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
    function vote(uint256 candidateId) public votingActive {
        require(voters[msg.sender].isRegistered, "You are not a registered voter.");
        require(!voters[msg.sender].hasVoted, "You have already voted.");
        require(candidateId > 0 && candidateId <= candidatesCount, "Invalid candidate.");

        // Record the vote
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedFor = candidateId;

        // Increment the candidate's vote count
        candidates[candidateId].voteCount++;

        emit Voted(msg.sender, candidateId);
    }

    // Function to get the winner(s)
    function getWinner() public view returns (string memory winnerName, uint256 winnerVoteCount) {
        require(votingEnded, "Voting has not ended yet.");

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
        require(candidateId > 0 && candidateId <= candidatesCount, "Invalid candidate ID.");
        Candidate memory candidate = candidates[candidateId];
        return (candidate.name, candidate.voteCount);
    }
}
