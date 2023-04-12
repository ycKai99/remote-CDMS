 
export type dataStorageInterface 
= dataStorageInterfaceRead | dataStorageInterfaceWrite | dataStorageInterfaceUpdate | dataStorageInterfaceDelete

export interface dataStorageInterfaceRead{
    operation:"read", 
    entityName:string, // type of data
    uuid?:string // data identifier 
}

export interface dataStorageInterfaceWrite{
    operation:"write", 
    entityName:string, // type of data
    uuid:string // data identifier 
    data:string // data 
}

export interface dataStorageInterfaceUpdate{
    operation:"update", 
    entityName:string, // type of data
    uuid:string // data identifier 
    data:string // data 
}

export interface dataStorageInterfaceDelete{
    operation:"delete", 
    entityName:string, // type of data
    uuid:string // data identifier  
}