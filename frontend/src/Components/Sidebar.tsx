import { Link } from 'react-router-dom'
import React from 'react'
import { SidebarData } from './SidebarData'
import styled from 'styled-components'
import '../App.css';
import './Sidebar.css'

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

    return (
         <>
            <SidebarMenu>
            {SidebarData.map((item, index) => {
                    return (
                        <MenuItems key={index}>
                        <MenuItemLinks to={item.path} className='only-links'>
                            <span style={{marginLeft: '0px'}}>{item.icon}
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

