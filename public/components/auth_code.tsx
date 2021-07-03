import styles from '@styles/Auth.module.css'
import { useRef, useState } from 'react';
import { Check } from 'react-feather';

const AuthCode: React.FC<{ submissionCallback: Function }> = ({ submissionCallback }) => {
    const [ code, setCode ] = useState(["", "", "", ""]);
    const [ invalidCode, setInvalidCode ] = useState(false);
    const [ codeAccepted, setCodeAccepted ] = useState(false);
    const [ focused, setFocused ] = useState(true); 

    const input_ref = useRef();

    return (
        <div className={styles.authCode}>
            <div className={styles.codeAuth} onClick={() => {
                //@ts-expect-error
                input_ref.current?.focus()
            }}>
                <div>
                    {
                        code.map((e, i) => {
                            return <div key={`CA-${i}`} className={e == "" ? "" : styles.filledCodeInputModule}>
                                {
                                    e == "" && i == 0 && focused ?
                                    <div className={styles.cursorDiv}></div>
                                    :
                                    e == "" && code[i - 1] !== "" && focused ? 
                                    <div className={styles.cursorDiv}></div>
                                    :
                                    e
                                }
                            </div>
                        })
                    }
                </div>
                    
                {
                    codeAccepted && <div className={styles.approvedCodeOverlay}>
                        <Check size={22} color={"var(--text-normal)"}/>
                    </div>
                }
                
                
                <input 
                    type="text" 
                    autoFocus
                    hidden={false}  
                    defaultValue={code.join('')}
                    onBlur={() => {
                        setFocused(false)
                    }}
                    onFocus={() => {
                        setFocused(true)
                    }}
                    onKeyPress={(e) => {
                        if(e.key == "Enter")
                            submissionCallback(code.join(''), (result) => {
                                if(result == false) {
                                    setInvalidCode(true);
                                    //@ts-expect-error
                                    input_ref.current.value = "";
                                    setCode(["", "", "", ""])
                                }else {
                                    setCodeAccepted(true);
                                }
                            });
                    }}
                    onChange={(e) => { 
                        const new_code_value = e.target.value.toUpperCase().split('');
                        const rep_value = [];

                        setInvalidCode(false);

                        if(new_code_value.length < 4) {
                            rep_value.push(...new_code_value)
                            rep_value.push(...Array.apply(null, Array(4 - new_code_value.length)).map(function (x, i) { return ""; }))
                        }
                        if(new_code_value.length >= 4) {
                            rep_value.push(...new_code_value.slice(0, 4))
                            //@ts-expect-error
                            input_ref.current.value = e.target.value.substring(0, 4);
                        }

                        setCode(rep_value)
                    }} 
                    ref={input_ref}
                />
            </div>
            
            <div className={styles.invalidCode}>
                {
                    invalidCode && <div>
                                        <br />
                                        <p>Invalid Code <a href="">Not sure what this is?</a></p>
                                    </div>
                }
            </div>
        </div>
    )
}

export { AuthCode }