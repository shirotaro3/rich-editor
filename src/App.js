import react, { useState, useEffect, useCallback, useRef } from 'react';
import sanitizeHtml from 'sanitize-html';
import { useUpdate } from 'react-use';
import styled from 'styled-components';
import Editor from './Editor';
import { IoIosArrowBack } from 'react-icons/io';
import faker from 'faker';
import 'dayjs/locale/ja';
import dayjs from 'dayjs';
dayjs.locale(`ja`);

const App = ({ className }) =>
{
    const [ waiting, setWaiting ] = useState( false );
    const [ items, setItems ] = useState( [] );
    const members = items.length;
    const onSubmit = useCallback( ( value ) =>
    {
        return new Promise( (resolve, reject) =>
        {
            setWaiting( true );
            setTimeout( () =>
            {
                const div = document.getElementById(`message-container`);
                const now = dayjs();
                const timeStr = now.format('h:mm');
                setItems( [ ...items,
                {
                    message: value,
                    name: faker.name.firstName() + ` ` + faker.name.lastName(),
                    date: `${timeStr} ${now.hour() >= 12 ? `PM` : `AM`}`,
                    color: faker.random.number(10),
                } ] );
                div.scrollTop = div.scrollHeight;
                setWaiting( false );
                resolve();
            }, 500 );
        });
    }, [ waiting ] );

    return (
        <div className={className}>
            <div className={`header`}>
                <div className={`arrow`}>
                    <IoIosArrowBack size={18} />
                </div>
                <div>
                    <div className={`channel-name`}>⭐︎最初のチャンネル</div>
                    <div className={`channel-text`}>{members} members</div>
                </div>
            </div>
            <div className={`content`}>
                <div id={`message-container`} className={`message-container`}>
                    {items.map(item => {
                        return (
                            <div className={`message`} key={item.name}>
                                <div className={`user`}>
                                    <img src={`user.png`} className={`user-icon`} color={item.color} />
                                </div>
                                <div>
                                    <div>
                                        <span className={`user-name`}>{item.name}</span>
                                        <span className={`date`}>{item.date}</span>
                                    </div>
                                    <div className={`html`} dangerouslySetInnerHTML={{__html: item.message}} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={`footer`}>
                <Editor
                    placeholder={`最初のチャンネル にメッセージを投稿する`}
                    onSubmit={onSubmit}
                    waiting={waiting}
                />
            </div>
        </div>
    );
};

const Styled = styled(App)`
    font-family: Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    ul, ol
    {
        list-style-position: inside;
        margin: 0;
        padding: 0;
        padding-left: 10px;
    }
    p
    {
        margin: 0;
        padding: 0;
    }
    .header
    {
        display: flex;
        height: 35px;
        padding: 10px 10px;
        border-bottom: 1px solid #0000001F;
        @media screen and ( min-width:480px )
        {
            padding: 10px 20px;
        }
    }
    .header .arrow
    {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        @media screen and ( min-width:480px )
        {
            display: none;
        }
    }
    .header .channel-name
    {
        font-size: 15px;
        font-weight: bold;
    }
    .header .channel-text
    {
        font-size: 12px;
        color: #0000007F;
    }
    .content
    {
        flex-grow: 1;
        position: relative;
    }
    .content .message-container
    {
        position: absolute;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
        bottom: 0;
        left: 0;
        width: 100%;
        max-height: calc(100% - 15px);
        padding-bottom: 15px;
    }
    .message-container .message
    {
        @keyframes accordion
        {
            0%{ background-color: #0000002F; }
            100%{ background-color: none; }
        }
        display: flex;
        position: relative;
        animation: 1s linear 1 accordion;
        font-size: 14px;
        padding: 5px 20px;
        &:hover
        {
            background: #00000009;
        }
        p
        {
            margin: 1px;
            padding: 0px;
        }
    }
    .message .user
    {
        width: 35px;
        padding-right: 10px;
    }
    .message .html
    {
        padding-top: 3px;
    }
    .user .user-icon
    {
        height: 35px;
        width: 35px;
        border-radius: 4px;
        object-fit: cover;
    }
    .user-icon[color='0']
    {
        background-color: lightgrey;
    }
    .user-icon[color='1']
    {
        background-color: pink;
    }
    .user-icon[color='2']
    {
        background-color: orange;
    }
    .user-icon[color='3']
    {
        background-color: violet;
    }
    .user-icon[color='4']
    {
        background-color: tomato;
    }
    .user-icon[color='5']
    {
        background-color: lightblue;
    }
    .user-icon[color='6']
    {
        background-color: lightgreen;
    }
    .user-icon[color='7']
    {
        background-color: red;
    }
    .user-icon[color='8']
    {
        background-color: blue;
    }
    .user-icon[color='9']
    {
        background-color: green;
    }
    .user-icon[color='10']
    {
        background-color: yellow;
    }
    .user-name
    {
        font-weight: bold;
        font-size: 14px;
    }
    .date
    {
        font-size: 12px;
        color: #0000007F;
        margin-left: 7px;
    }
    .footer
    {
        padding: 0;
        @media screen and ( min-width:480px )
        {
            padding: 0 20px 20px 20px;
        }
    }
`;

export default Styled;
