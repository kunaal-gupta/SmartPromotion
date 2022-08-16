// SPDX-License-Identifier: GPL-3.0
pragma solidity = 0.5.16;

contract Hiring {

    struct User {
        string Name;
        string Title;
        uint Salary;
    }

    struct Achievement {
        uint UserId_forKey;
        string achName;
        string ProjName;
        uint achValue;
        uint ProjAllocatedTime;
        uint ProjCompTime;
    }

    
    mapping (uint => User) public Users;
    mapping (uint => Achievement) public Achievements;

    event UserCreated(
        uint UserId,
        string Name
    );

    event UserAchievCreated(
        uint AchievId,
        string ProjName,
        uint achValue
    );

    constructor() public {
        createUser('UserName', 'UserTitle', 0);
        CreateUserAchiev(0, "achName", "ProjName", 0, 0, 0);

    }

    uint public UserId = 0;
    function createUser(string memory Name, string memory Title, uint Salary) public {
        Users[UserId] = User(Name, Title, Salary);
        UserId++;
        emit UserCreated(UserId, Name);
    }

    uint public AchievId = 0;
    function CreateUserAchiev(uint UserId_forKey, string memory achName, string memory ProjName, uint achValue, uint ProjAllocatedTime, uint ProjCompTime) public {
        Achievements[AchievId] = Achievement(UserId_forKey, achName, ProjName, achValue, ProjAllocatedTime, ProjCompTime);
        AchievId++;
        emit UserAchievCreated(AchievId, ProjName, achValue);
    }
}