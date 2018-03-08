pragma solidity ^0.4.13;

contract RockPaperScissors {
  event GameCreated(address creator, uint gameNumber, uint bet);
  event GameStarted(address[] players, uint gameNumber);
  event GameComplete(address winner, uint gameNumber);
  
  uint public matchCount;
  struct Match {
      address p1;
      address p2;
      uint move1;
      uint move2;
      uint state; // 1: notfull, 2: full, 3: complete
      uint bet;
  }
  mapping(uint => Match) public matchDb;
  
  
  /**
 * Use this endpoint to create a game. 
 * It is a payable endpoint meaning the creator of the game will send ether directly to it.
 * The ether sent to the contract should be used as the bet for the game.
 * @param participant {address} - The address of the participant allowed to join the game.
 */
  function createGame(address participant) public payable {
    require(msg.value > 0);
    matchCount++;
    matchDb[matchCount] = Match(msg.sender, participant, 0, 0, 1, msg.value);
    
    GameCreated(msg.sender, matchCount - 1, msg.value);
  }
  
  /**
 * Use this endpoint to join a game.
 * It is a payable endpoint meaning the joining participant will send ether directly to it.
 * The ether sent to the contract should be used as the bet for the game. 
 * Any additional ether that exceeds the original bet of the creator should be refunded.
 * @param gameNumber {uint} - Corresponds to the gameNumber provided by the GameCreated event
 */
  function joinGame(uint gameNumber) public payable {
    Match storage info = matchDb[gameNumber];
    require(info.state == 1);
    require(msg.value >= info.bet);
    require(msg.sender == info.p2);
    
    if (msg.value > info.bet) {
        msg.sender.transfer(msg.value - info.bet);
    }
    
    info.state = 2;
    address[] memory tmp = new address[](2);
    tmp[0] = (info.p1);
    tmp[1] = (info.p2);
    GameStarted(tmp, gameNumber);
  }
  
  /**
 * Use this endpoint to make a move during a game 
 * @param gameNumber {uint} - Corresponds to the gameNumber provided by the GameCreated event
 * @param moveNumber {uint} - The move for this player (1, 2, or 3 for rock, paper, scissors respectively)
 */
  function makeMove(uint gameNumber, uint moveNumber) public { 
    Match storage info = matchDb[gameNumber];
    require(info.state == 2);
    require(msg.sender == info.p1 || msg.sender == info.p2);
    require(moveNumber == 1 || moveNumber == 2 || moveNumber == 3);

    if (msg.sender == info.p1) {
        info.move1 = moveNumber;
    } else {
        info.move2 = moveNumber;
    } 
    
    if (info.move1 * info.move2 != 0) {
        uint a = info.move1;
        uint b = info.move2;
        uint res = 0;

        // Rule checkers
        if (a == b) {
            res = 0;
        } else if (a == 1) {
            if (b == 3) {
                res = 1;
            } else {
                res = 2;
            }
        } else if (a == 2) {
            if (b == 1) {
                res = 1;
            } else {
                res = 2;
            }
        } else if (a == 3) {
            if (b == 2) {
                res = 1;
            } else {
                res = 2;
            }
        }
        
        // Transfer reward
        if (res == 0) {
            uint refund = info.bet / 2;
            info.p1.transfer(refund);
            info.p2.transfer(refund);
            GameComplete(address(0), gameNumber);
        } else if (res == 1) {
            info.p1.transfer(info.bet);
            GameComplete(info.p1, gameNumber);
        } else if (res == 2) {
            info.p2.transfer(info.bet);
            GameComplete(info.p2, gameNumber);
        }

        info.state = 3;
    }
    
  }
}