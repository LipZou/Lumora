export function isLoggedIn() {
    return !!localStorage.getItem('user');
}

export function signOut(navigate) {
    localStorage.removeItem('user');
    navigate('/');
}