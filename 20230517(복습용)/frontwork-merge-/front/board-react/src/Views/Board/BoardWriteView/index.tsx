import { ChangeEvent, KeyboardEvent, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios, { AxiosResponse } from 'axios';

import { Box, Fab, Input, Divider, Typography, IconButton } from '@mui/material'
import CreateIcon from '@mui/icons-material/Create';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { FILE_UPLOAD_URL, POST_BOARD_URL, POST_PRODUCT_URL, authorizationHeader, mutipartHeader } from 'src/constants/api';
import { PostBoardDto, PostProductDto } from 'src/apis/request/board';
import { PostBoardResponseDto } from 'src/apis/response/board';
import ResponseDto from 'src/apis/response';
import { Product } from 'src/interfaces';
import { usePostProductStore } from 'src/stores';

export default function BoardWriteView() {
    // hook //
    const navigator = useNavigate();

    const imageRef = useRef<HTMLInputElement | null>(null);
    const imageRef2 = useRef<HTMLInputElement | null>(null);
    const imageRef3 = useRef<HTMLInputElement | null>(null);

    const [cookies] = useCookies();

    const { boardContent, boardImgUrl1, boardImgUrl2, boardImgUrl3, tag } = usePostProductStore();
    const { product1, product2, product3, product4, product5, product6 } = usePostProductStore();
    const { setBoardContent, setBoardImgUrl1, setBoardImgUrl2, setBoardImgUrl3, setTag } = usePostProductStore();

    // const [boardContent, setBoardContent] = useState<string>('');
    // const [boardImgUrl1, setBoardImgUrl] = useState<string>('');
    // //? handler여러개 만들어야 이미지 여러개 들어가는듯
    // const [boardImgUrl2, setBoardImgUrl2] = useState<string>('');
    // const [boardImgUrl3, setBoardImgUrl3] = useState<string>('');
    // const [tag, setTag] = useState<string>('');

    const accessToken = cookies.accessToken;

    // event handler //
    const onBoardContentKeyPressHandler = (event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (event.key !== 'Enter') return;
        setBoardContent(boardContent + '/n');
    }

    const onBoardImageUploadButtonHandler = () => {
        if (!imageRef.current) return;
        imageRef.current.click();
    }
    const onBoardImageUploadButtonHandler2 = () => {
        if (!imageRef2.current) return;
        imageRef2.current.click();
    }
    const onBoardImageUploadButtonHandler3 = () => {
        if (!imageRef3.current) return;
        imageRef3.current.click();
    }

    const onBoardImageUploadChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const data = new FormData();
        data.append('file', event.target.files[0]);
        axios.post(FILE_UPLOAD_URL, data, mutipartHeader())
            .then((response) => boardImageUploadResponseHandler(response))
            .catch((error) => boardImageUploadErrorHandler(error))
    }
    const onBoardImageUploadChangeHandler2 = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const data = new FormData();
        data.append('file', event.target.files[0]);
        axios.post(FILE_UPLOAD_URL, data, mutipartHeader())
            .then((response2) => boardImageUploadResponseHandler2(response2))
            .catch((error) => boardImageUploadErrorHandler(error))
    }
    const onBoardImageUploadChangeHandler3 = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const data = new FormData();
        data.append('file', event.target.files[0]);
        axios.post(FILE_UPLOAD_URL, data, mutipartHeader())
            .then((response3) => boardImageUploadResponseHandler3(response3))
            .catch((error) => boardImageUploadErrorHandler(error))
    }

    const onBoardContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const value = event.target.value;
        setBoardContent(value);
    }
    const onTagChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setTag(value);
    }

    const onBoardWriteHandler = () => {
        if (!boardImgUrl1.trim() || !boardContent.trim()) {
            alert('모든 내용을 작성해주세요!');
            return;
        }
        // navigator('/post-product');
        if (!product1 || !product2 || !product3) {
            alert('모든 내용을 작성해주세요!');
            return;
        }
        const productList: Product[] = [product1, product2, product3];
        if (product4) productList.push(product4);
        if (product5) productList.push(product5);
        if (product6) productList.push(product6);

        postBoard();
        productList.forEach(product => postProduct(product));
    }
    const postBoard = () => {
        const data: PostBoardDto = { boardContent, boardImgUrl1, boardImgUrl2, boardImgUrl3, tag };

        axios.post(POST_BOARD_URL, data, authorizationHeader(accessToken))
            .then((response) => postBoardResponseHandler(response))
            .catch((error) => postBoardErrorHandler(error))
    }

    const postProduct = (product: Product) => {
        const data: PostProductDto = { ...product };

        axios.post(POST_PRODUCT_URL, data, authorizationHeader(accessToken))
            .then((response) => postProductResponseHandler(response))
            .catch((error) => postBoardErrorHandler(error))
    }

    // response handler //
    const boardImageUploadResponseHandler = (response: AxiosResponse<any, any>) => {
        const imageUrl = response.data as string;
        if (!imageUrl) return;
        setBoardImgUrl1(imageUrl);
    }
    const boardImageUploadResponseHandler2 = (response: AxiosResponse<any, any>) => {
        const imageUrl2 = response.data as string;
        if (!imageUrl2) return;
        setBoardImgUrl2(imageUrl2);
    }
    const boardImageUploadResponseHandler3 = (response: AxiosResponse<any, any>) => {
        const imageUrl3 = response.data as string;
        if (!imageUrl3) return;
        setBoardImgUrl3(imageUrl3);
    }

    const postBoardResponseHandler = (response: AxiosResponse<any, any>) => {
        const { result, message, data } = response.data as ResponseDto<PostBoardResponseDto>
        if (!result || !data) {
            alert(message);
            return;
        }
        navigator('/');
    }

    // error handler //
    const postBoardErrorHandler = (error: any) => {
        console.log(error.message);
    }
    const boardImageUploadErrorHandler = (error: any) => {
        console.log(error.message);
    }

    // use effect //
    useEffect(() => {
        if(!accessToken) {
            navigator('/')
            return;
        }
    },[])

    return (
        <Box sx={{ paddingTop: '100px' }}>
            {/* //? 게시물 본문 */}
            <Box sx={{ width: '100%', display: 'block', textAlign: 'center' }}>
                {/* //? 본문 사진 업로드 : 여러 박스에 올리려면 어떻게 해야하는가 */}
                <Box sx={{ p: '15px 0' }}>
                    <Box sx={{ width: '100%' }} >
                        <Box sx={{ width: '50%' }} component='img' src={boardImgUrl1} />
                    </Box>
                    <Box sx={{}}>
                        <IconButton onClick={() => onBoardImageUploadButtonHandler()} >
                            <AddAPhotoIcon />
                            <input ref={imageRef} hidden type='file' accept='image/*' onChange={(event) => onBoardImageUploadChangeHandler(event)} />
                        </IconButton>
                    </Box>
                </Box>
                <Divider sx={{ m: '40px 0' }} />
                <Box sx={{ p: '15px 0' }}>
                    <Box sx={{ width: '100%' }} >
                        <Box sx={{ width: '50%' }} component='img' src={boardImgUrl2} />
                    </Box>
                    <Box sx={{}}>
                        <IconButton onClick={() => onBoardImageUploadButtonHandler2()} >
                            <AddAPhotoIcon />
                            <input ref={imageRef2} hidden type='file' accept='image/*' onChange={(event) => onBoardImageUploadChangeHandler2(event)} />
                        </IconButton>
                    </Box>
                </Box>
                <Divider sx={{ m: '40px 0' }} />
                <Box sx={{ p: '15px 0' }}>
                    <Box sx={{ width: '100%' }} >
                        <Box sx={{ width: '50%' }} component='img' src={boardImgUrl3} />
                    </Box>
                    <Box sx={{}}>
                        <IconButton onClick={() => onBoardImageUploadButtonHandler3()} >
                            <AddAPhotoIcon />
                            <input ref={imageRef3} hidden type='file' accept='image/*' onChange={(event) => onBoardImageUploadChangeHandler3(event)} />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ display: 'block-flex', justifyContent: 'center', mt: '45px', ml: '225px', p: '15px 0px', width: '70%', border: 0.3, borderRadius: 0.5, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                    {/* //? 스타일 태그 */}
                    <Typography sx={{ m: '4px 10px 0 20px' }} >스타일 :</Typography>
                    <Input disableUnderline sx={{ mr: '10px', border: 0.05, width: '130px', height: '25px' }} onChange={(event) => onTagChangeHandler(event)} />
                    {/* //? 본문 내용 입력 */}
                    <Input sx={{ width: '800px' }} minRows={12} fullWidth multiline disableUnderline placeholder='내용을 입력하세요'
                        onChange={(event) => onBoardContentChangeHandler(event)}
                        onKeyDown={(event) => onBoardContentKeyPressHandler(event)} />
                </Box>
            </Box>

            <Divider />

            {/* <IconButton onClick={() => navigator(`http:/localhost:4040/product/post-product`)} >
                <ArrowForwardIcon />
            </IconButton> */}

            <Fab sx={{ position: 'fixed', bottom: '150px', right: '100px' }} onClick={() => onBoardWriteHandler()}>
                <CreateIcon />
            </Fab>
        </Box>     
 )

    // todo : BoardWriteView - ProductWriteView로 나누고 router에서 각각 받아오는게 나은가? // 상품 이미지박스 하나당 핸들러 각각 만들어야 함
}