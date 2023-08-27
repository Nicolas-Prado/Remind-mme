import { UserTeam, databaseUserTeam } from "../models/UserTeamModel"
import { Request, Response } from "express"
import validatorJS from "validator"
import { User, databaseUser } from "../models/UserModel"

type ErrorJSON = {
    error:any
}

function generateErrorJSON(err:any = 'Server internal error'){
    const errorJSON:ErrorJSON = {
        error: { err }
    }

    return errorJSON
}

export function getLevelSegmentsInTeamWithUsers(teamId:string) {
    return new Promise<{ level: number, users: User[] }[] | ErrorJSON>(async (resolve, reject) => {
        databaseUserTeam.find({ teamId: teamId }).sort({ userId: 1 }).exec(function (err, usersTeams: UserTeam[]) {
            if(err)
                resolve(generateErrorJSON())

            if(!usersTeams)
                resolve(generateErrorJSON("group don't have any member"))

            databaseUser.find({ _id: { $in: usersTeams.map(userTeam => userTeam.userId) } }).sort({ _id: 1 }).exec(function (err, users:User[]) {
                if(err)
                    resolve(generateErrorJSON())

                if(!users)
                    resolve(generateErrorJSON("group don't have any member"))

                if(users.length != usersTeams.length)
                    resolve(generateErrorJSON())

                let results:{ level: number, users: User[] }[] = []
                usersTeams.forEach((userTeam, index) => {
                    if(typeof results[userTeam.level] === 'undefined'){
                        results[userTeam.level] = { level: userTeam.level, users: [users[index]] }
                    }
                    else{
                        results[userTeam.level].level = userTeam.level
                        results[userTeam.level].users.push(users[index])
                    }
                })

                results = results!.filter(result => result != null).sort((a, b) => a.level - b.level)

                resolve(results)
            })
        })
    })
}

export function getUserAndMaxLevelInGroup(userId:string, teamId:string) {
    return new Promise<{ loggedUserLevel:number, maxLevel:number } | ErrorJSON>(async (resolve, reject) => {
        databaseUserTeam.findOne({ userId: userId, teamId:teamId }, function (err, userTeam:UserTeam) {
            if(err)
                resolve(generateErrorJSON())

            if(!userTeam)
                resolve(generateErrorJSON('User / Team relationship not found'))

            databaseUserTeam.find({}).sort({ level: -1 }).limit(1).exec(function (err, maxLevel:UserTeam[]) {
                if(err)
                    resolve(generateErrorJSON())
                    
                if(!maxLevel)
                    resolve(generateErrorJSON('Empty User / Team relationship'))

                resolve({ loggedUserLevel:userTeam.level, maxLevel:maxLevel[0].level })
            })
        })
    })
}