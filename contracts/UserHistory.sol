pragma solidity >0.4.99 <0.6.0;

contract UserHistory {

    event UserHistoryCreated(
        uint historyId,
        string company,
        string startDate,
        string endDate,
        string role
    );
        
    struct UserHistory {
        string company;
        string startDate;
        string endDate;
        string role;
    }
    
    UserHistory[] public userHistories;
    
    mapping (uint => address) public historyIdToOwner;
    mapping (address => uint[]) public ownerToHistoryIds;
    mapping (address => uint) public userHistoryCount;
    
    function setHistory(
        string memory _company,
        string memory _startDate,
        string memory _endDate,
        string memory _role) public {
            // UserHistoryにpushし、戻り値-1をidとする
            uint id = userHistories.push(UserHistory(_company, _startDate, _endDate, _role)) - 1;
            // データをhistoryIdToOwner, ownerToHistoryIdsに登録
            historyIdToOwner[id] = msg.sender;
            ownerToHistoryIds[msg.sender].push(id);
            // userHistoryCountをincrement
            userHistoryCount[msg.sender]++;
            // Event
            emit UserHistoryCreated(id, _company, _startDate, _endDate, _role);
    }
    
    function getOwnHistoryIds(address _address) public view returns (uint[] memory) {
        // historyId[]からUserHistoryの要素を取得
        return ownerToHistoryIds[_address];
    }

    function getOwnHistories(uint _historyId) public view returns (string memory, string memory, string memory, string memory) {
        // historyIdからUserHistoryの全要素を取得
        return (userHistories[_historyId].company,
                userHistories[_historyId].startDate,
                userHistories[_historyId].endDate,
                userHistories[_historyId].role);
    }
}