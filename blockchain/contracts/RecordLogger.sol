// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RecordLogger {
    event RecordLogged(address indexed user, string recordHash, uint256 timestamp);

    struct Record {
        address user;
        string recordHash;
        uint256 timestamp;
    }

    Record[] public records;

    function logRecord(string memory recordHash) public {
        Record memory newRecord = Record(msg.sender, recordHash, block.timestamp);
        records.push(newRecord);
        emit RecordLogged(msg.sender, recordHash, block.timestamp);
    }

    function getRecordCount() public view returns (uint256) {
        return records.length;
    }
}
