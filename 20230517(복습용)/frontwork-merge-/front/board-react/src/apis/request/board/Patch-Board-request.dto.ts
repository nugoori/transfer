interface PatchBoardDto {
    boardNumer: number,
    boardContent: string,
    boardImgUrl1: string,
    boardImgUrl2: string | null,
    boardImgUrl3: string | null,
    tag: string
}

export default PatchBoardDto;