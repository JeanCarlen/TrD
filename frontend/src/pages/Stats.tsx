import React from "react";
import './Stats.css';
import Sidebar from "../Components/Sidebar";
import LayoutGamestats from "./Layout-gamestats";
import LayoutPlayerstats from "./Layout-playerstats"

const Stats: React.FunctionComponent = () => {
  return (
    <div className='stats-container'>
      <Sidebar />
      <div className='text'>
      </div>
      <div className='grid' style={{paddingBottom:"10vh"}}>
          {/* <h2>Match History</h2> */}
        <div className='history_1' style={{overflowY:"auto"}}>
			  <LayoutPlayerstats/>
			  </div>
        <div className='history_1'> 
            <LayoutGamestats/>
            <LayoutGamestats/>
            <LayoutGamestats/>
            <LayoutGamestats/>
            <LayoutGamestats/>
            <LayoutGamestats/>
        </div>
        <div className='hf'>
          <h2>Achievements</h2>
          <div className='box'>
            here is bobby, bobby is a nice dude
        </div>
        </div>
      </div>
      </div>
  )
}

export default Stats;
