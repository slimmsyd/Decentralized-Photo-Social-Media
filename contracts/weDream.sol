// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract weDream {
  string public name =  "wedream";

  //Store Images
  uint public imagecount = 0;
  mapping(uint => Image) public images;   

  //Create Your Own Data Type For Images 
  struct Image { 
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
  }

  event ImageCreated (
    uint id,
    string hash,
    string description, 
    uint tipAmount, 
    address payable author
  );

  event ImageTipped(
    uint id, 
    string hash, 
    string description, 
    uint tipAmount, 
    address payable author
  );


  //Create Images

  function uploadImage(string memory _imageHash, string memory _description ) public {
    //Makes Sure that Description is Never Blank
    require(bytes(_description).length > 0);

    //Make sure ImageHash Exist
    require(bytes(_imageHash).length > 0 );

    //Make sure uploader address exist
    require(msg.sender != address(0)); 




    //Increment ImageId -> Create Dynamic Image
    imagecount++; 


    //Adds Images To Contract -> Also to add Its in a OPEN database using IPFS so image count is differnet everytime
    images[imagecount] = Image(imagecount, _imageHash, _description, 0, msg.sender); //msg.sender -> Person who calling the Image. 

    //Create An Event that allows you to know when the Image Was Uploaded(push noti, logs etc.)
    emit ImageCreated(imagecount, _imageHash, _description, 0, msg.sender);

    

  } 
  
  
  //Tip Images 
  //PAYBLE{IMPORTANT IF YOU WANT TO SEND CRYPTO CURRENCTY}
    function tipImageOwner(uint _id) public payable { 

    //Make sure the ID is valid {PREVENT TIPPING THE WRONG IMAGE}
    require(_id > 0 && _id <= imagecount);

    //Fetch The Image
    Image memory _image = images[_id];

    //Fetch The Author 
    address payable _author = _image.author; 

    //PAY THE AUTHOR BY SENDING THEM ETHER
    address(_author).transfer(msg.value); //MSG.VALUE(AMOUNT OF CRYPTO CURRECNTY THAT IS SENT IN WHEN FUNCTION IS CALLED)


  //Increment the Tip Amount 
  _image.tipAmount = _image.tipAmount + msg.value; 

  //Update the Image {put the image back on the blockchain}
  images[_id] = _image;

  //EMIT EVENT

  emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author); 

  }


}




