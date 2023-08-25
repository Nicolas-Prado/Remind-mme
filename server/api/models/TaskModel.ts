import Datastore from 'nedb'

import { User } from './UserModel'
import { Group } from './GroupModel'
 
export type Task = {
    userId: string
    groupId: string

    finalDate: Date | null
    name: string
    description: string | null
    importance: number | null

    user: User | undefined
    group: Group | undefined

    createdAt: Date
    updatedAt: Date
}



export const database = new Datastore('./../../database/tasks.db');
database.loadDatabase()