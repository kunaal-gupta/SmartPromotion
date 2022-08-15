// SPDX-License-Identifier: GPL-3.0
pragma solidity = 0.5.16;

contract Hiring {

    struct User {
        string Name;
        string Title;
        uint Salary;
    }

    struct Achievement {
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
    }

    uint public UserId = 0;
    function createUser(string memory Name, string memory Title, uint Salary) public {
        UserId++;
        Users[UserId] = User(Name, Title, Salary);
        emit UserCreated(UserId, Name);
    }

    uint public AchievId = 0;
    function CreateUserAchiev(string memory achName, string memory ProjName, uint achValue, uint ProjAllocatedTime, uint ProjCompTime) public {
        AchievId++;
        Achievements[AchievId] = Achievement(achName, ProjName, achValue, ProjAllocatedTime, ProjCompTime);
        emit UserAchievCreated(AchievId, ProjName, achValue);
    }

    function ReadUser(uint UId) public view returns(string memory, string memory, uint) {
        string memory Name = Users[UId].Name;
        string memory Title = Users[UId].Title;
        uint Salary = Users[UId].Salary;
        
        return ( Name, Title, Salary);
    }

    function ReadUserAchiev(uint AchId) public view returns(string memory, string memory, uint, uint, uint) {
        string memory achName = Achievements[AchId].achName;
        string memory ProjName = Achievements[AchId].ProjName;
        uint achValue = Achievements[AchId].achValue;
        uint ProjAllocatedTime = Achievements[AchId].ProjAllocatedTime;
        uint ProjCompTime = Achievements[AchId].ProjCompTime;

        return (achName, ProjName, achValue, ProjAllocatedTime, ProjCompTime);
    }









}