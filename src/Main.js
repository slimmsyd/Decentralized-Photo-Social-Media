import React, {useState} from 'react'
import Web3 from 'web3';
import Button from './Button';



 const Main = (props) => {
  const [firstDescription, setDescription] = useState('')


  return (
    <div>
      <h1>Share Image</h1>
      <form onSubmit={(event) => { 
        event.preventDefault();
        const description =  firstDescription
        props.uploadImage(description)
      }}>
        <input type = "file" accept =".jpg,.jpeg, .png, .bmp, .gif" onChange={props.captureFile} />
        <div className ="form-group">
          <br></br>
          <input onChange={event => setDescription(event.target.value)}
            id = "imageDescription"
            type = "text"
            placeholder='Image Description'
            required
          />
        </div>
        <button type = "submit" className ="btn">Upload!</button>
      </form>

      <p>&nbsp;</p>

     {props.images.map((image,key) => {
       return(
        <div className="card mb-4" key={key} >
          <div className="card-header">
            {/* <img
              className='mr-2'
              width='30'
              height='30'
              src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}
            /> */}
            <small className="text-muted">{image.author}</small>
          </div>
          <ul id="imageList" className="list-group list-group-flush">
            <li className="list-group-item">
              <p class="text-center"><img src={`https://ipfs.infura.io/ipfs/${image.hash}`} style={{ maxWidth: '420px'}}/></p>
              <p>{image.description}</p>
            </li>
            <li key={key} className="list-group-item py-2">
              <small className="float-left mt-1 text-muted">
                TIPS: {Web3.utils.fromWei("1", 'Ether')} ETH
              </small>
              <button
                className="btn btn-link btn-sm float-left pt-0"
                name={image.id}
                onClick={(event) => {
                  let tipAmount = Web3.utils.toWei('0.1', 'Ether')
                  console.log(event.target.name, tipAmount)
                  props.tipImageOwner(event.target.name, tipAmount)
                }}
              >
                TIP 0.1 ETH
              </button>
            </li>
          </ul>
        </div>
      )
    })}
    </div>
  )
}

export default Main;

