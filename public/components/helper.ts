
/**
 * @param short_name The compressed form, Software Variation (spaces become -, with no capital letters)
 * @returns The uncompressed form, User Variation (- becomes spaces, with capital letters)
 */

import { KeyHandler } from "@public/@types/event";
import { KeyboardEvent } from "react";

export const mimifiedToFull = (short_name) => {
    return short_name.replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
}

/**
 * 
 * @param full_name The uncompressed form, User Variation (- becomes spaces, with capital letters)
 * @returns The compressed form, Software Variation (spaces become -, with no capital letters)
 */

export const fullToMimified = (full_name) => {
    return full_name.toLowerCase().replace(/\s/g, '-');
}

/**
 * 
 * @param email Full email string
 * @returns String in format ***@email_provider.com
 */

export const emailFilter = (email) => {
    return email.replace(/^[^@]*@/g, (str) => {
        return str.replace(/[^@]/g, '*')
    })
}

/**
 * 
 * @param string any valid string 
 * @returns string in format ***...
 */

 export const textCensor = (string) => {
    return string.replace(/./g, (str) => {
        return str.replace(/./g, '*');
    })
}


/**
 * 
 * @param keyHandlers An array of KeyHandler objects which contain a key and a fulfilment
 * @param event A key event object (HTML)
 * @param case_sensitive Boolean defining if the function comparing keys should consider cases.
 * @param log_mode Defines if the function should read updates of matchings [DEVELOPMENT] 
 */

export const handleKeyEvents = (keyHandlers: KeyHandler[], keyInteractions: any[], event: any, direction: 'up' | 'down', case_sensitive: boolean = false, log_mode: boolean = false) => {
    if(direction == 'down') {
        if(!keyInteractions.find((e) => e.key == event.key)) {
            keyInteractions.push({
                key: event.key,
                date: new Date().getTime()
            });
        }

        return;
    }

    keyHandlers.forEach((handler: KeyHandler, index: number) => {
        const key_stored = keyInteractions.find((e) => e.key == event.key)
        if(!key_stored) return;
        
        console.log((new Date().getTime() - key_stored?.date), key_stored.key)

        if((new Date().getTime() - key_stored?.date) >= handler.duration)
            if(case_sensitive)
                if(handler.expected_key == event.key) {
                    if(log_mode) console.log(`Matching! ${handler.expected_key} matches expected of ${event.key} CS/OFF`)

                    handler.fufil();
                    keyHandlers = keyHandlers.splice(index, 1);
                    keyInteractions = keyInteractions.splice(keyInteractions.findIndex((e) => e.key == event.key), 1);
                }else {
                    keyInteractions = keyInteractions.splice(keyInteractions.findIndex((e) => e.key == event.key), 1);
                    if(log_mode) console.log(`Not Matching: ${handler.expected_key} does not match expected of ${event.key} CS/OFF`)
                }
            else 
                if(handler.expected_key.toLowerCase() == event.key.toLowerCase()) {
                    if(log_mode) console.log(`Matching! ${handler.expected_key.toLowerCase()} matches expected of ${event.key.toLowerCase()}`);

                    handler.fufil();
                    keyHandlers = keyHandlers.splice(index, 1);
                    keyInteractions = keyInteractions.splice(keyInteractions.findIndex((e) => e.key == event.key), 1);
                }else {
                    keyInteractions = keyInteractions.splice(keyInteractions.findIndex((e) => e.key == event.key), 1);
                    if(log_mode) console.log(`Not Matching: ${handler.expected_key.toLowerCase()} does not match expected of ${event.key.toLowerCase()}`)
                }
        else  {
            keyInteractions = keyInteractions.splice(keyInteractions.findIndex((e) => e.key == event.key), 1);
            if(log_mode) console.log("Ahhh, just didnt cut it huh.", (new Date().getTime() - key_stored?.date), key_stored.key)
        }
    })
}