import react, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Quill from 'quill';
import Delta from 'quill-delta';
// import 'react-quill/dist/quill.snow.css';
import { MdSend, MdFormatBold, MdFormatItalic, MdFormatStrikethrough, MdLink, MdFormatUnderlined, MdFormatListBulleted, MdFormatListNumbered } from 'react-icons/md';
import { HiOutlinePaperClip } from 'react-icons/hi';
import { ImSpinner2 } from 'react-icons/im';

const Editor = ( props ) =>
{
    const [ editor, setEditor ] = useState();
    const [ sendable, setSendable ] = useState(false);
    const [ focus, setFocus] = useState(false);
    const onSubmit = useCallback( async( e ) =>
    {
        e.preventDefault();
        setFocus(true);
        const value = editor.root.innerHTML;
        if( value === `<p><br></p>` )
        {
            return;
        };
        await props.onSubmit( value );
        editor.setContents([{ insert: `\n`}]);
        editor.setSelection(0, 0);
    } );

    useEffect( () =>
    {
        const editor = new Quill('#editor',
        {
            modules:
            {
                toolbar:
                {
                    container: '#toolbar',
                    handlers:
                    {
                        'link': function(value) {
                            if (value) {
                              var href = prompt('Enter the URL');
                              editor.format('link', href);
                            } else {
                              editor.format('link', false);
                            }
                        }                      
                    }
                }
            },
            placeholder: props.placeholder !== undefined ? props.placeholder : ``,
        });
        const onFocus = () =>
        {
            setFocus(true);
        };
        const onBlur = () =>
        {
            setFocus(false);
        }
        editor.clipboard.addMatcher('img', function(node, delta) {
            return new Delta();
        });
        editor.root.addEventListener(`focus`, onFocus);
        editor.root.addEventListener(`blur`, onBlur);
        editor.on(`text-change`, function(){
            if( editor.root.innerHTML !== `<p><br></p>` )
            {
                setSendable(true);
            }
            else
            {
                setSendable(false);
            }
        });
        setEditor( editor );
    }, [ Quill ]);

    return (
        <div className={props.className}>
            <div id={`editor`} />

            <div id={`toolbar`} className={`${focus===true?`enabled`:``}${sendable===true?` enabled-mobile`:``}`}>
                <div className={`left-container`}>
                    <button className={`ql-bold${focus===true?` bt-enabled`:``}`} ><MdFormatBold size={18} /></button>
                    <button className={`ql-italic${focus===true?` bt-enabled`:``}`} ><MdFormatItalic size={18} /></button>
                    <button className={`ql-strike${focus===true?` bt-enabled`:``}`} ><MdFormatStrikethrough size={18} /></button>
                    <button className={`ql-underline${focus===true?` bt-enabled`:``}`} ><MdFormatUnderlined size={18} /></button>
                    <button className={`ql-list${focus===true?` bt-enabled`:``}`} value={`bullet`} ><MdFormatListBulleted size={18} /></button>
                    <button className={`ql-list${focus===true?` bt-enabled`:``}`} value={`ordered`} ><MdFormatListNumbered size={18} /></button>
                    <button className={`${focus===true?` bt-enabled`:``}`} ><MdLink size={18}/></button>
                </div>
                <div className={`right-container`}>
                    <button className={`bt-enabled`}><HiOutlinePaperClip size={18} /></button>
                    <button className={`submit-button${sendable===true?` bt-enabled`:``}`} onClick={onSubmit}>
                        { props.waiting === true ?
                            <ImSpinner2 className={`spinner`} size={18} /> :
                            <MdSend size={18} />
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

const Styled = styled(Editor)`
    font-family: Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    border-radius: 4px;
    border-top: 1px solid #0000001F;
    @media screen and ( min-width:480px )
    {
        border: 1px solid #0000005F;
    }
    #toolbar
    {
        transition: 0.3s;
        box-sizing: border-box;
        display: flex;
        height: 45px;
        button
        {
            transition: 0.3s;
            margin: 1px;
            border: none;
            border-radius: 4px;
            outline: none;
            background: none;
            height: 100%;
            width: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #0000002F;
        }
        .bt-enabled
        {
            color: #0000008F !important;
            &:hover
            {
                background-color: #0000000F;
            }
        }
        .left-container
        {
            display: flex;
            height: 100%;
        }
        .right-container
        {
            display: flex;
            height: 100%;
            margin-left: auto;
        }
        .spinner
        {
            @keyframes rotation
            {
                0%{ transform:rotate(0); }
                100%{ transform:rotate(360deg); }
            }
            animation: 0.8s linear infinite rotation;
        }
        visibility: hidden;
        max-height: 0;
        position: fixed;
        @media screen and ( min-width:480px )
        {
            visibility: visible;
            max-height: 50px;
            padding: 5px;
            position: static;
        }
    }
    .enabled
    {
        visibility: visible !important;
        max-height: 50px !important;
        position: static !important;
        @media screen and ( min-width:480px )
        {
            background-color: #00000006;
        }
    }
    .enabled-mobile
    {
        @media screen and ( max-width:480px )
        {
            visibility: visible !important;
            max-height: 50px !important;
            position: static !important;
        }
    }
    // quill
    .ql-container
    {
        box-sizing: border-box;
        font-size: 14px;
        height: 100%;
        margin: 0;
        position: relative;
    }
    .ql-editor
    {
        box-sizing: border-box;
        line-height: 1.42;
        height: 100%;
        outline: none;
        overflow-y: auto;
        padding: 12px 15px;
        tab-size: 4;
        text-align: left;
        white-space: pre-wrap;
    }
    .ql-editor.ql-blank::before
    {
        color: #0000005F;
        content: attr(data-placeholder);
        left: 15px;
        pointer-events: none;
        position: absolute;
        right: 15px;
    }
    .ql-clipboard
    {
        left: -100000px;
        height: 1px;
        overflow-y: hidden;
        position: absolute;
        top: 50%;
    }
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
`;

export default Styled;
