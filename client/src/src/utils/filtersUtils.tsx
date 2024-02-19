import _ from 'lodash'

export const defaultFilterParams = {
    minAge: 18,
    maxAge: 99,
    minElo: 20,
    maxElo: 1000,
    distance: 50,
    minTags: 1,
}

export const checkFilterParams = (setAgeSliderValue: (value: number[]) => void, setEloSliderValue: (value: number[]) => void, setDistanceSliderValue: (value: number) => void, setMinTagsSliderValue: (value: number) => void) => {
    if (localStorage.getItem("filterParams")) {
        try {
            const filterParams = JSON.parse(localStorage.getItem("filterParams") || "")

            const filterParamsKeys = Object.keys(filterParams)
            const defaultFilterParamsKeys = Object.keys(defaultFilterParams)

            if (_.isEqual(filterParamsKeys, defaultFilterParamsKeys) && filterParamsKeys.every((key) => typeof filterParams[key] === 'number')) {
                if (filterParams.minAge < 18 || filterParams.minAge > 99 || filterParams.maxAge < 18 || filterParams.maxAge > 99 || filterParams.minAge > filterParams.maxAge)
                    localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
                else if (filterParams.minElo < 0 || filterParams.minElo > 1000 || filterParams.maxElo < 0 || filterParams.maxElo > 1000 || filterParams.minElo > filterParams.maxElo)
                    localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
                else if (filterParams.distance < 1 || filterParams.distance > 200)
                    localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
                else if (filterParams.minTags < 0 || filterParams.minTags > 20)
                    localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
                else {
                    setAgeSliderValue([filterParams.minAge, filterParams.maxAge])
                    setEloSliderValue([filterParams.minElo, filterParams.maxElo])
                    setDistanceSliderValue(filterParams.distance)
                    setMinTagsSliderValue(filterParams.minTags)
                }
            }
            else {
                localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
            }

        }
        catch {
            localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
        }
    }
    else {
        localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
    }

}