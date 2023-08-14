import React from 'react'
import { Link } from 'react-router-dom'
import * as FaIcons from 'react-icons/fa' 
import { SidebarData } from './SidebarData'

const Sidebar: React.FunctionComponent = () => {
    return (
        <>
            <Navbar>
                <MenuIconOpen to="#">
                    <FaIcons.FaBars />
                </MenuIconOpen>
            </Navbar>
			{SidebarData.map((item, index) => {
                    return (
                        <MenuItems key={index}>
                            <MenuItemLinks to={item.path}>
                                {item.icon}
                                <span style={{marginLeft: '16px'}}>{item.title}</span>
                            </MenuItemLinks>
                        </MenuItems>
                    )
                })}
            </SidebarMenu>
       </>
   )
}
export default Sidebar
