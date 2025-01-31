export type User = {
    id: string;
    name: string;
    age: number;
    isAdmin: boolean;
    email: {
        domain: string;
        local: string;
        tld: string;        
    };
    contacts: string[];
}