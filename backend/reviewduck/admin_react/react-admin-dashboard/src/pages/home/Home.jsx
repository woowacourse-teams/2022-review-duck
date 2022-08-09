import React from "react";
import './home.css'

const headers= {
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
}


function socialLoginHandler(){
  window.location.assign(`https://github.com/login/oauth/authorize?client_id=24e1a1f66eeab14f6ee0`, headers)
}

export default function Home(){
    return (
        <div className="home">
            <button 
                className='socialLoginButton' 
                onClick={socialLoginHandler}
            >Admin Login
            </button>
        </div>
    )
}