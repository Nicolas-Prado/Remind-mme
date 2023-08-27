import { Team, databaseTeam } from "../models/TeamModel"
import { UserTeam, databaseUserTeam } from "../models/UserTeamModel"
import { Request, Response } from "express"
import validatorJS from "validator"

type ErrorJSON = {
    error:any
}

function generateErrorJSON(err:any = 'Server internal error'){
    const errorJSON:ErrorJSON = {
        error: { err }
    }

    return errorJSON
}

async function validator(teamJSON:Team) {}

export function createTeamByOwner(userId:string){
    return new Promise<Team | ErrorJSON>(async (resolve, reject) => {
        const team:Team = { name: "Template", createdAt: new Date(), updatedAt: new Date() }
        databaseTeam.insert(team, function(err, team:Team) {
            if(err)
                resolve(generateErrorJSON())

            const userTeam:UserTeam = { userId: userId, teamId: team._id as string,  level: 1, createdAt: new Date(), updatedAt: new Date() }
            databaseUserTeam.insert(userTeam, function(err, userTeam:UserTeam) {
                if(err)
                    resolve(generateErrorJSON())

                resolve(team)
            })
        })
    })
}