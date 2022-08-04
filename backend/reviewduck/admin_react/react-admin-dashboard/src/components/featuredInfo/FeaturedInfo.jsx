import React from 'react'
import './featuredInfo.css'

export default function FeaturedInfo(){
    return (
        <div className='feature'>
            <div className='featuredItem'>
                <span className='featuredTitle'>Revenue</span>
                <div className='featuredMoneyContainer'>
                    <span className='featuredMoney'>$2,415</span>
                    <span className='featuredMoneyRate'>-11.4</span>
                </div>
                <span className='featuredSub'>Compared to last month</span>
            </div>
        </div>

    )
}