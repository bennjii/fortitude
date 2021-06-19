
/**
 * @param short_name The compressed form, Software Variation (spaces become -, with no capital letters)
 * @returns The uncompressed form, User Variation (- becomes spaces, with capital letters)
 */

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