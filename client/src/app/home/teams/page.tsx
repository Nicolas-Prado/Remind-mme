'use client'
import Team from "@/app/components/Team"
import TeamGenerator from "@/app/components/TeamGenerator"
import { useQuery } from "@tanstack/react-query"
import styles from "@/app/styles/teams.module.scss"
import { useRouter } from "next/navigation"
import { useState } from "react"
import TeamModel from "@shared/models/TeamModel"
import UserModel from "@shared/models/UserModel"
import ErrorJSON from "@shared/models/ErrorJSON"
import UserShowcase from "@/app/components/UserShowcase"
 
export default function Teams() {
    type UserShowcaseData = {
        user: UserModel
        userLevel: number
        loggedUser: UserModel
        loggedUserLevel: number
        maxTeamLevel: number
        team: TeamModel
    }

    const router = useRouter()
    const [ teams, setTeams ] = useState<TeamModel[] | null>(null)
    const [ isUserShowcaseEnabled, setUserShowcaseEnabled ] = useState(false)
    const [ userShowcaseData, setUserShowcaseData ] = useState<UserShowcaseData|null>(null)

    function setUserShowcaseFromComponents(userShowcaseDate:UserShowcaseData){
        setUserShowcaseData(userShowcaseDate)
        setUserShowcaseEnabled(true)
    }

    const userQuery = useQuery({
        queryKey: ['users'],
        queryFn: () => {
            return fetch('http://localhost:22194/users/webtoken', { 
                credentials: 'include',
            })
            .then((res) => res.json())
            .then((resJson: UserModel | ErrorJSON) => {
                if('error' in resJson) 
                    throw resJson
                return resJson
            })
            .then((res: UserModel) => !res?._id ? router.push('/login') : res)
        },
        refetchInterval: 5000,
        onSuccess: (data: UserModel) => {
            setTeams(data.teams || null)
        }
    })

    if(userQuery.isLoading)
        return <></>

    if(userQuery.isError)
        return <></>

    return (
        <>
            <div className={styles['teams-wrapper']}>
                <div className={styles.teams}>
                    {teams && teams.map((team) => <Team key={team._id } team={team} loggedUser={userQuery.data} setUserShowcaseData={setUserShowcaseFromComponents} />)}
                </div>
                <TeamGenerator user={userQuery.data} />
            </div>
            {isUserShowcaseEnabled && userShowcaseData &&
                <UserShowcase user={userShowcaseData.user} userLevel={userShowcaseData.userLevel} loggedUser={userShowcaseData.loggedUser} loggedUserLevel={userShowcaseData.loggedUserLevel} maxTeamLevel={userShowcaseData.maxTeamLevel} team={userShowcaseData.team} setCompressedOn={() => setUserShowcaseEnabled(false)} />
            }
        </>
    )
}