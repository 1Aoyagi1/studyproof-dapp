// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title StudyProof - a simple on-chain study check-in log
contract StudyProof {
    struct CheckIn {
        address user;
        string subject;
        string note;
        uint256 timestamp;
    }

    CheckIn[] private checkIns;

    event CheckInAdded(
        address indexed user,
        string subject,
        string note,
        uint256 timestamp
    );

    function addCheckIn(string memory subject, string memory note) external {
        require(bytes(subject).length > 0, "Subject cannot be empty");
        require(bytes(note).length > 0, "Note cannot be empty");

        CheckIn memory newCheckIn = CheckIn({
            user: msg.sender,
            subject: subject,
            note: note,
            timestamp: block.timestamp
        });

        checkIns.push(newCheckIn);
        emit CheckInAdded(msg.sender, subject, note, block.timestamp);
    }

    function getCheckInCount() external view returns (uint256) {
        return checkIns.length;
    }

    function getCheckIn(uint256 index) external view returns (
        address user,
        string memory subject,
        string memory note,
        uint256 timestamp
    ) {
        require(index < checkIns.length, "Check-in does not exist");
        CheckIn memory checkIn = checkIns[index];
        return (checkIn.user, checkIn.subject, checkIn.note, checkIn.timestamp);
    }
}
