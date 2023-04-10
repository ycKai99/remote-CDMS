 
export type dataStorageInterface 
= dataStorageInterfaceRead | dataStorageInterfaceWrite | dataStorageInterfaceUpdate | dataStorageInterfaceDelete

export interface dataStorageInterfaceRead{
    operation:"read", 
    entityname:string, // type of data
    uuid?:string // data identifier 
}

export interface dataStorageInterfaceWrite{
    operation:"write", 
    entityname:string, // type of data
    uuid:string // data identifier 
    data:string // data 
}

export interface dataStorageInterfaceUpdate{
    operation:"update", 
    entityname:string, // type of data
    uuid:string // data identifier 
    data:string // data 
}

export interface dataStorageInterfaceDelete{
    operation:"delete", 
    entityname:string, // type of data
    uuid:string // data identifier  
}