import { useState } from "react"
import { Button, ButtonGroup, Card, Modal } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import { ProfilesModel } from "./models/ProfilesModel";

enum SortEnum {
    ASCENDING = 'asc',
    DESCENDING = 'desc',
    NULL = 0,
}

enum SortCategoryEnum {
    AGE = 'age',
    ELO = 'elo',
    DISTANCE = 'distance',
    COMMONTAGS = 'commonTags',
}

interface SortProfilesComponentProps {
    profiles: ProfilesModel[]
    setProfiles: (profiles: ProfilesModel[]) => void
}

const SortProfilesComponent = ({ profiles, setProfiles }: SortProfilesComponentProps) => {
    const [sortParams, setSortParams] = useState({
        age: SortEnum.NULL,
        elo: SortEnum.NULL,
        distance: SortEnum.NULL,
        commonTags: SortEnum.NULL,
    })
    const [isSortModalOpened, setIsSortModalOpened] = useState(false)

    const sortProfiles = (sort: SortCategoryEnum) => {
        const sortedProfiles = [...profiles]
        switch (sort) {
            case SortCategoryEnum.AGE:
                sortedProfiles.sort((a, b) => {
                    if (sortParams.age === SortEnum.ASCENDING)
                        return a.age - b.age
                    else
                        return b.age - a.age
                })
                setSortParams(prev => ({ ...prev, age: prev.age === SortEnum.ASCENDING ? SortEnum.DESCENDING : SortEnum.ASCENDING, elo: SortEnum.NULL, distance: SortEnum.NULL, commonTags: SortEnum.NULL }))
                break
            case SortCategoryEnum.ELO:
                sortedProfiles.sort((a, b) => {
                    if (sortParams.elo === SortEnum.ASCENDING)
                        return a.elo - b.elo
                    else
                        return b.elo - a.elo
                })
                setSortParams(prev => ({ ...prev, elo: prev.elo === SortEnum.ASCENDING ? SortEnum.DESCENDING : SortEnum.ASCENDING, age: SortEnum.NULL, distance: SortEnum.NULL, commonTags: SortEnum.NULL }))
                break
            case SortCategoryEnum.DISTANCE:
                sortedProfiles.sort((a, b) => {
                    if (sortParams.distance === SortEnum.ASCENDING)
                        return a.distance - b.distance
                    else
                        return b.distance - a.distance
                })
                setSortParams(prev => ({ ...prev, distance: prev.distance === SortEnum.ASCENDING ? SortEnum.DESCENDING : SortEnum.ASCENDING, age: SortEnum.NULL, elo: SortEnum.NULL, commonTags: SortEnum.NULL }))
                break
            case SortCategoryEnum.COMMONTAGS:
                sortedProfiles.sort((a, b) => {
                    if (sortParams.commonTags === SortEnum.ASCENDING)
                        return a.commonTags.length - b.commonTags.length
                    else
                        return b.commonTags.length - a.commonTags.length
                })
                setSortParams(prev => ({ ...prev, commonTags: prev.commonTags === SortEnum.ASCENDING ? SortEnum.DESCENDING : SortEnum.ASCENDING, age: SortEnum.NULL, elo: SortEnum.NULL, distance: SortEnum.NULL }))
                break
            default:
                break
        }
        setProfiles(sortedProfiles)
    }

    return (
        <>
            <Modal
                open={isSortModalOpened}
                onClose={() => { setIsSortModalOpened(false) }}
            >
                <div className="row justify-content-center p-0 p-2 filtersModal">
                    <Card className="col-xs-12 col-sm-12 col-md-10 col-lg-8 col-xl-6 col-xxl-5 pt-2 d-flex w-100 flex-column" elevation={6}>
                        <div className="d-flex justify-content-end align-items-center w-100">
                            <Button className="mb-2" style={{ minWidth: 0, padding: 0 }} onClick={() => { setIsSortModalOpened(false) }}>
                                <CloseIcon color="primary" />
                            </Button>
                        </div>
                        <div style={{ width: "300px" }} className="d-flex flex-column">
                            <ButtonGroup size="medium" className="mb-2 w-100">
                                <Button key="age" className="w-100 align-items-center" onClick={() => sortProfiles(SortCategoryEnum.AGE)}>
                                    <p className="m-0 me-1 mt-1">Age</p>
                                    {sortParams.age === SortEnum.ASCENDING ? <NorthEastIcon color="primary" /> : sortParams.age === SortEnum.DESCENDING ? <SouthEastIcon color="primary" /> : <SwapVertIcon color="primary" />}
                                </Button>
                                <Button key="commonTags" className="w-100" onClick={() => sortProfiles(SortCategoryEnum.COMMONTAGS)}>
                                    <p className="m-0 me-1 mt-1">Common tags</p>
                                    {sortParams.commonTags === SortEnum.ASCENDING ? <NorthEastIcon color="primary" /> : sortParams.commonTags === SortEnum.DESCENDING ? <SouthEastIcon color="primary" /> : <SwapVertIcon color="primary" />}
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup size="medium" className="mb-2 w-100">
                                <Button key="location" className="w-100" onClick={() => sortProfiles(SortCategoryEnum.DISTANCE)}>
                                    <p className="m-0 me-1 mt-1">Distance</p>
                                    {sortParams.distance === SortEnum.ASCENDING ? <NorthEastIcon color="primary" /> : sortParams.distance === SortEnum.DESCENDING ? <SouthEastIcon color="primary" /> : <SwapVertIcon color="primary" />}
                                </Button>
                                <Button key="elo" className="w-100" onClick={() => sortProfiles(SortCategoryEnum.ELO)}>
                                    <p className="m-0 me-1 mt-1">Fame rating</p>
                                    {sortParams.elo === SortEnum.ASCENDING ? <NorthEastIcon color="primary" /> : sortParams.elo === SortEnum.DESCENDING ? <SouthEastIcon color="primary" /> : <SwapVertIcon color="primary" />}
                                </Button>
                            </ButtonGroup>
                        </div>
                    </Card>
                </div>
            </Modal>
            <Button className="sortButton ms-3 mt-3" onClick={() => { setIsSortModalOpened(true) }} title="Sort">
                <SortRoundedIcon color="primary" />
            </Button>
        </>
    )
}

export default SortProfilesComponent