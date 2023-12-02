import { Link } from 'react-router-dom'
import React from 'react'
import { SidebarData } from './SidebarData'
import styled from 'styled-components'
import '../App.css';
import { useState } from 'react'
import './Sidebar.css'

// const MenuIconClose = styled(Link)`
//     display: flex;
//     justify-content: start;
//     font-size: 1.5rem;
//     margin-top: 2rem;
//     padding-left: 20px;
//     color: #ffffff;
// `

// const MenuIconOpen = styled(Link)`
//     display: flex;
//     justify-content: start;
//     font-size: 1.5rem;
//     margin-top: -2rem;
//     margin-left: 15rem;
//     color: #ffffff;
// `
const SidebarMenu = styled.div`
    width: 100px;
    height: 100%;
    background-color: #310c22;
    position: fixed;
    top: 0;
    left: 0;
    transition: .6s;

    &:hover
    {;
        width:180px;

    }
    `
const MenuItems = styled.li`
    list-style: none;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: start;
    width: auto;
    height: 90px;
    `

    const MenuItemLinks = styled(Link)`
`
const Sidebar: React.FunctionComponent = () => {
    // const [close, setClose] = useState(false)
    // const showSidebar = () => setClose(!close)
    const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);

    const handleMouseEnter = (pageName: string) => {
        setHoveredLogo(pageName);
      };

      const handleMouseLeave = () => {
        setHoveredLogo(null);
      };

    return (
         <>
            <SidebarMenu>
            {SidebarData.map((item, index) => {
                    return (
                        <MenuItems key={index}>
                        <MenuItemLinks to={item.path} className='only-links'>
                            <span  onMouseEnter={() => handleMouseEnter(item.title)}
                            onMouseLeave={handleMouseLeave} style={{marginLeft: '0px'}}>{item.icon}
                            <div className="logo-name">{item.title}</div>
                            </span>
                        </MenuItemLinks>
                        </MenuItems>
                    )
            })}
            </SidebarMenu>
       </>
   )
}
export default Sidebar

