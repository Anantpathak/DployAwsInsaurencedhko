import React from 'react';

const PaymentComponent = () => {
  return (
    <div className="payment mt-5">
      <div className="creditcard">
        <div className="thecard">
          <div className="top-card">
            <div className="circle"></div>
            <div className="card-title">
              The Card
            </div>
          </div>
          <div className="card-info">
            <div className="card-number">
              1234 5678 9012 3456
            </div>
            <div className="exp-date">
              01 / 2018
            </div>
            <div className="card-holder">
              John Doe
            </div>
          </div>
        </div>
      </div>
      <div className="form p-3 mt-5 shadow">
        <form action="" method="get">
          <label htmlFor="cardnumber">Card Number</label>
          <input className='form-control' type="text" id="cardnumber" placeholder="1234 5678 9012 3456" />
          <label htmlFor="cardholder">Card Holder</label>
          <input className='form-control' type="text" id="cardholder" placeholder="John Doe" />
          <label htmlFor="cardholder">Address</label>
          <textarea className='form-control mb-3' id="address"
           placeholder="Address" rows={4}></textarea>
  
          <label htmlFor="exp">Expiration Date</label>
          <div className="date">
            <select name="month" id="month" className='form-select' >
              <option value="january">January</option>
              <option value="february">February</option>
              <option value="march">March</option>
              <option value="april">April</option>
              <option value="may">May</option>
              <option value="june">June</option>
              <option value="july">July</option>
              <option value="august">August</option>
              <option value="september">September</option>
              <option value="october">October</option>
              <option value="november">November</option>
              <option value="december">December</option>
            </select>
            <select name="Year" className='form-select' >
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div className="small">
            <div className="cvc">
              <label htmlFor="cvc">CVC</label>
              <input className='form-control'
               type="text" id="cvc" maxLength="3" size="4" placeholder="123" />
            </div>
            <p>Three or four digits, usually found on the back of the card</p>
          </div>
          <button className='btn btn-success'>Proceed</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentComponent;
