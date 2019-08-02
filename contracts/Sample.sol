pragma solidity >0.4.99 <0.6.0;

contract Sample {

    string public value;

    function setValue(string memory _value) public {
        value = _value;
    }

    function getValue() public view returns(string memory){
        return value;
    }
}
