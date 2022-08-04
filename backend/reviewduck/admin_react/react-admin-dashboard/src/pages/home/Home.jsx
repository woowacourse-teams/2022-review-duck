import React from "react";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import './home.css'
import WidgetSm from '../../components/widgetSm/WidgetSm'
import WidgetLg from '../../components/widgetLg/WidgetLg'

export default function Home(){
    return (
        <div className="home">
            <FeaturedInfo />
            <div className="homeWidgets">
                <WidgetSm />
                <WidgetLg />
            </div>
        </div>
    )
}