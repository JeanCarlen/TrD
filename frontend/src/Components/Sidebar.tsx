import { Link } from 'react-router-dom'
import React from 'react'
import * as FaIcons from 'react-icons/fa'
import { SidebarData } from './SidebarData'
import styled from 'styled-components'
import '../App.css';
import { useState } from 'react'
import Logout from '../pages/LogOut'

const MenuIconClose = styled(Link)`
    display: flex;
    justify-content: start;
    font-size: 1.5rem;
    margin-top: 2rem;
    padding-left: 20px;
    color: #ffffff;
`

const MenuIconOpen = styled(Link)`
    display: flex;
    justify-content: start;
    font-size: 1.5rem;
    margin-top: -7rem;
    margin-left: 10rem;
    color: #ffffff;
`
const SidebarMenu = styled.div<{close: boolean}>`
    width: 250px;
    height: 100vh;
    background-color: #310c22;
    position: fixed;
    top: 0;
    left: ${({ close}) => close ? '0' : '-100%'};
    transition: .6s;
`
const MenuItems = styled.li`
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: 90px;
    padding: 1rem 0.2 0.25rem;
`

const MenuItemLinks = styled(Link)`
    display: flex;
    align-items: center;
    padding: 0 2rem;
    font-size: 20px;
    text-decoration: none;
    color: #ffffff;

    &:hover {
        background-color: #ffffff;
        color: #4b082f;
        width: 100%;
        height: 45px;
        text-align: center;
        border-radius: 5px;
        margin: 0 2rem;
    }
`
const Sidebar: React.FunctionComponent = () => {
    const [close, setClose] = useState(false)
    const showSidebar = () => setClose(!close)
    return (
         <>
            <div>
                <MenuIconOpen to="#" onClick={showSidebar}>
                    <FaIcons.FaBars />
                </MenuIconOpen>
            </div>
            <SidebarMenu close={close}>
                <MenuIconClose to="#" onClick={showSidebar}>
                    <FaIcons.FaTimes />
                </MenuIconClose>
            {SidebarData.map((item, index) => {
                    return (
                        <MenuItems key={index}>
                        <MenuItemLinks to={item.path}>
                            {item.icon}
                            <span style={{marginLeft: '16px'}}>{item.title}</span>
                        </MenuItemLinks>
                        </MenuItems>
                        // <div className="Menu-bar">
                        //      <MenuItemLinks to={item.path}>
                        //     {item.icon}
                        //         <span className="MenuNames" style={{marginLeft: '16px'}}>{item.title}</span>
                        //     </MenuItemLinks>
                        //     <li key={index}>
                        //     </li>
                        // </div>
                    )
            })}
            </SidebarMenu>
       </>
   )
}
export default Sidebar

