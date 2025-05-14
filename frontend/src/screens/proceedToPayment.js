import React from 'react';
import Navbar from '../components/navBar';
import PaymentComponent from '../components/payment';
function ProceedToPayment() {
    return (
        <>
            <div className="container bg-white">
                <Navbar />
                <div className='row'>
                 <PaymentComponent/>   
                </div>
            </div>
        </>
    );
}

export default ProceedToPayment;
