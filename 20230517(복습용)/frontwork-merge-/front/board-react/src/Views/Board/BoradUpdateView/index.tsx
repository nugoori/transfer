import { ChangeEvent, KeyboardEvent, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios, { AxiosResponse } from 'axios';
import { useParams } from "react-router-dom";

import { Box, Divider, Fab, IconButton, Input, Typography } from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

import { useUserStore } from "src/stores";
import ResponseDto from 'src/apis/response';
import { FILE_UPLOAD_URL, GET_BOARD_URL, GET_PRODUCT_URL, PATCH_BOARD_URL, PATCH_PRODUCT_URL, authorizationHeader, mutipartHeader } from 'src/constants/api';
import { GetBoardResponseDto } from 'src/apis/response/board';
import { GetProductResponseDto } from 'src/apis/response/product';
import { PatchBoardDto, PatchProductDto } from 'src/apis/request/board';

export default function BoardUpdateView() {
  // hook //
  const navigator = useNavigate();

  const imageRef = useRef<HTMLInputElement | null>(null);
  const imageRef2 = useRef<HTMLInputElement | null>(null);
  const imageRef3 = useRef<HTMLInputElement | null>(null);
  const productImgRef = useRef<HTMLInputElement | null>(null);

  const { user } = useUserStore();
  const { boardNumber } = useParams();
  const { productNumber } = useParams();

  const [cookies] = useCookies();
  const [boardContent, setBoardContent] = useState<string>('');
  const [boardImgUrl1, setBoardImgUrl] = useState<string>('');
  const [boardImgUrl2, setBoardImgUrl2] = useState<string | null>('');
  const [boardImgUrl3, setBoardImgUrl3] = useState<string | null>('');
  const [tag, setTag] = useState<string>('');
  const [productImgUrl, setProductImgUrl] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [productUrl, setProductUrl] = useState<string>('');

  const accessToken = cookies.accessToken;

  // event handler //
  const onUpdateButtonHandler = () => {
    if (!boardImgUrl1.trim() || !boardContent.trim() || !productImgUrl.trim() || !productName.trim() || !productPrice.trim() || !productUrl.trim()) {
      alert('모든 내용을 작성해주세요!');
      return;
    }
    patchBoard();
  }

  const getBoard = () => {
    axios.get(GET_BOARD_URL(boardNumber as string))
      .then((response) => getBoardResponseHandler(response))
      .catch((error) => getBoardErrorHandler(error))
  }
  const getProduct = () => {
    axios.get(GET_PRODUCT_URL(productNumber as string))
      .then((response) => getProductResponseHandler(response))
      .catch((error) => getProductErrorHandler(error))
  }

  const onBoardContentKeyPressHandler = (event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    setBoardContent(boardContent + '/n');
  }
  const onProductImageUploadButtonHandler = () => {
    if (!productImgRef.current) return;
    productImgRef.current.click();
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
  const onProductImageUploadChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const data = new FormData();
    data.append('file', event.target.files[0]);
    axios.post(FILE_UPLOAD_URL, data, mutipartHeader())
      .then((response) => productImageUploadResponseHandler(response))
      .catch((error) => productImageUploadErrorHandler(error))
  }
  const onBoardContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = event.target.value;
    setBoardContent(value);
  }
  const onTagChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setTag(value);
  }
  const onProductNameChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setProductName(value);
  }
  const onProductPriceChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setProductPrice(value + '원');
  }
  const onProductUrlChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setProductUrl(value);
  }

  const patchBoard = () => {
    const data: PatchBoardDto & PatchProductDto = {
      boardNumer: parseInt(boardNumber as string),
      boardContent,
      boardImgUrl1,
      boardImgUrl2,
      boardImgUrl3,
      tag,
      productNumber: parseInt(productNumber as string),
      productImgUrl,
      productName,
      productPrice,
      productUrl
    }

    axios.patch(PATCH_BOARD_URL && PATCH_PRODUCT_URL, data, authorizationHeader(accessToken))
      .then((response) => patchBoardResposneHandler(response))
      .catch((error) => patchBoardErrorHandler(error))
  }

  // response handler //
  const getBoardResponseHandler = (response: AxiosResponse<any, any>) => {
    const { result, message, data } = response.data as ResponseDto<GetBoardResponseDto>
    if (!result || !data) {
      alert(message);
      navigator('/');
      return;
    }
    const { boardContent, boardImgUrl1, boardImgUrl2, boardImgUrl3, writerEmail } = data.board;
    if (writerEmail != user?.email) {
      alert('권한이 없습니다.')
      navigator('/');
      return;
    }
    setBoardContent(boardContent);
    setBoardImgUrl(boardImgUrl1);
    setBoardImgUrl2(boardImgUrl2);
    setBoardImgUrl3(boardImgUrl3);
  }
  //! //
  const getProductResponseHandler = (response: AxiosResponse<any, any>) => {
    const { result, message, data } = response.data as ResponseDto<GetProductResponseDto>
    if (!result || !data) {
      alert(message);
      navigator('/');
      return;
    }
    const { productName, productPrice, productUrl, productImgUrl } = data.product;
    setProductName(productName);
    setProductPrice(productPrice);
    setProductUrl(productUrl);
    setProductImgUrl(productImgUrl);
  }

  const patchBoardResposneHandler = (response: AxiosResponse<any, any>) => {
    const { result, message, data } = response.data as ResponseDto<PatchBoardDto>
    if (!result || !data) {
      alert(message);
      return;
    }
    navigator(`/board/detail/${boardNumber}`);
  }

  const boardImageUploadResponseHandler = (response: AxiosResponse<any, any>) => {
    const imageUrl = response.data as string;
    if (!imageUrl) return;
    setBoardImgUrl(imageUrl);
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
  const productImageUploadResponseHandler = (response: AxiosResponse<any, any>) => {
    const productImgUrl = response.data as string;
    if (!productImgUrl) return;
    setProductImgUrl(productImgUrl);
  }

  // error handler //
  const getBoardErrorHandler = (error: any) => {
    console.log(error.message);
  }
  const patchBoardErrorHandler = (error: any) => {
    console.log(error.message);
  }
  const getProductErrorHandler = (error: any) => {
    console.log(error.message);
  }
  const boardImageUploadErrorHandler = (error: any) => {
    console.log(error.message);
  }
  const productImageUploadErrorHandler = (error: any) => {
    console.log(error.message);
  }

  // use effect //
  useEffect(() => {
    if(!boardNumber) {
      navigator('/');
      return;
    }
    if(!productNumber) {
      navigator('/');
      return;
    }
    if(!accessToken) {
      navigator('/');
      return;
    }
    getBoard();
    getProduct();
  }, [])

  return (
    <Box>
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
              //! index.d.ts 2154번째 줄  src?: string | undefined | null- 추가 //
              <Box sx={{ width: '50%' }}  />
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
              <Box sx={{ width: '50%' }} />
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

        <Divider sx={{ m: '40px 0' }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', mt: '100px', pl: '450px', width: '1000px' }}>
          {/* //? 상품 업로드 박스 */}
          <Box >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* //? 상품 등록박스1 */}
              <Box sx={{ p: '15PX 15px', width: '235px', height: '285px', border: 0.3, borderRadius: 1 }}>
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ p: '15px 0' }}>
                    <Box sx={{ width: '100%' }} >
                      <Box sx={{ width: '100%', position: 'relative', zIndex: '1' }} component='img' src={productImgUrl} />
                    </Box>
                  </Box>

                  <Box sx={{ position: 'relative', zIndex: '1' }}>
                    <IconButton onClick={() => onProductImageUploadButtonHandler()} >
                      <AddAPhotoIcon />
                      <input ref={productImgRef} hidden type='file' accept='image/*' onChange={(event) => onProductImageUploadChangeHandler(event)} />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ ml: '5px', mt: '15px' }}>
                  <Input sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 이름'
                    onChange={(event) => onProductNameChangeHandler(event)} />
                  <Input sx={{ mt: '10px', backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 가격'
                    onChange={(event) => onProductPriceChangeHandler(event)} />
                  {/* //? url 이동 되는건가? */}
                  <Input sx={{ mt: '10px', mr: '5px', backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 구매 Url' type='url'
                    onChange={(event) => onProductUrlChangeHandler(event)} />
                </Box>
              </Box >
              {/* //? 상품 등록박스2 */}
              <Box sx={{ p: '15PX 15px', width: '235px', height: '285px', border: 0.3, borderRadius: 1 }}>
              <Box sx={{ display: 'flex' }}>
                  <Box sx={{ p: '15px 0' }}>
                    <Box sx={{ width: '100%' }} >
                      <Box sx={{ width: '100%' }} component='img' src={productImgUrl} />
                    </Box>
                  </Box>

                  <Box sx={{  }}>
                    <IconButton onClick={() => onProductImageUploadButtonHandler()} >
                      <AddAPhotoIcon />
                      <input ref={productImgRef} hidden type='file' accept='image/*' onChange={(event) => onProductImageUploadChangeHandler(event)} />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ ml: '5px', mt: '15px' }}>
                  <Input sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 이름'
                    onChange={(event) => onProductNameChangeHandler(event)} />
                  <Input sx={{ mt: '10px', backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 가격'
                    onChange={(event) => onProductPriceChangeHandler(event)} />
                  <Input sx={{ mt: '10px', mr: '5px', backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 구매 Url' type='url'
                    onChange={(event) => onProductUrlChangeHandler(event)} />
                </Box>
              </Box>
              {/* //? 상품 등록박스3 */}
              <Box sx={{ p: '15PX 15px', width: '235px', height: '285px', border: 0.3, borderRadius: 1 }}>
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ p: '15px 0' }}>
                    <Box sx={{ width: '100%' }} >
                      <Box sx={{ width: '100%', position: 'relative', zIndex: '1' }} component='img' src={productImgUrl} />
                    </Box>
                  </Box>

                  <Box sx={{ position: 'relative', zIndex: '1' }}>
                    <IconButton onClick={() => onProductImageUploadButtonHandler()} >
                      <AddAPhotoIcon />
                      <input ref={productImgRef} hidden type='file' accept='image/*' onChange={(event) => onProductImageUploadChangeHandler(event)} />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ ml: '5px', mt: '15px' }}>
                  <Input sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 이름'
                    onChange={(event) => onProductNameChangeHandler(event)} />
                  <Input sx={{ mt: '10px', backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 가격'
                    onChange={(event) => onProductPriceChangeHandler(event)} />
                  <Input sx={{ mt: '10px', mr: '5px', backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 구매 Url' type='url'
                    onChange={(event) => onProductUrlChangeHandler(event)} />
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: '20px', mb: '100px', display: 'flex', justifyContent: 'space-between' }}>
              {/* //? 상품 등록박스4 */}
              <Box sx={{ p: '15PX 15px', width: '235px', height: '285px', border: 0.3, borderRadius: 1 }}>
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ p: '15px 0' }}>
                    <Box sx={{ width: '100%' }} >
                      <Box sx={{ width: '100%', position: 'relative', zIndex: '1' }} component='img' src={productImgUrl} />
                    </Box>
                  </Box>

                  <Box sx={{ position: 'relative', zIndex: '1' }}>
                    <IconButton onClick={() => onProductImageUploadButtonHandler()} >
                      <AddAPhotoIcon />
                      <input ref={productImgRef} hidden type='file' accept='image/*' onChange={(event) => onProductImageUploadChangeHandler(event)} />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ ml: '5px', mt: '15px' }}>
                  <Input sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 이름'
                    onChange={(event) => onProductNameChangeHandler(event)} />
                  <Input sx={{ mt: '10px', backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 가격'
                    onChange={(event) => onProductPriceChangeHandler(event)} />
                  <Input sx={{ mt: '10px', mr: '5px', backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 구매 Url' type='url'
                    onChange={(event) => onProductUrlChangeHandler(event)} />
                </Box>
              </Box>
              {/* //? 상품 등록박스5 */}
              <Box sx={{ p: '15PX 15px', width: '235px', height: '285px', border: 0.3, borderRadius: 1 }}>
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ p: '15px 0' }}>
                    <Box sx={{ width: '100%' }} >
                      <Box sx={{ width: '100%', position: 'relative', zIndex: '1' }} component='img' src={productImgUrl} />
                    </Box>
                  </Box>

                  <Box sx={{ position: 'relative', zIndex: '1' }}>
                    <IconButton onClick={() => onProductImageUploadButtonHandler()} >
                      <AddAPhotoIcon />
                      <input ref={productImgRef} hidden type='file' accept='image/*' onChange={(event) => onProductImageUploadChangeHandler(event)} />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ ml: '5px', mt: '15px' }}>
                  <Input sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 이름'
                    onChange={(event) => onProductNameChangeHandler(event)} />
                  <Input sx={{ mt: '10px', backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 가격'
                    onChange={(event) => onProductPriceChangeHandler(event)} />
                  <Input sx={{ mt: '10px', mr: '5px', backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 구매 Url' type='url'
                    onChange={(event) => onProductUrlChangeHandler(event)} />
                </Box>
              </Box>
              {/* //? 상품 등록박스6 */}
              <Box sx={{ p: '15PX 15px', width: '235px', height: '285px', border: 0.3, borderRadius: 1 }}>
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ p: '15px 0' }}>
                    <Box sx={{ width: '100%' }} >
                      <Box sx={{ width: '100%', position: 'relative', zIndex: '1' }} component='img' src={productImgUrl} />
                    </Box>
                  </Box>

                  <Box sx={{ position: 'relative', zIndex: '1' }}>
                    <IconButton onClick={() => onProductImageUploadButtonHandler()} >
                      <AddAPhotoIcon />
                      <input ref={productImgRef} hidden type='file' accept='image/*' onChange={(event) => onProductImageUploadChangeHandler(event)} />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ ml: '5px', mt: '15px' }}>
                  <Input sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 이름'
                    onChange={(event) => onProductNameChangeHandler(event)} />
                  <Input sx={{ mt: '10px', backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 가격'
                    onChange={(event) => onProductPriceChangeHandler(event)} />
                  <Input sx={{ mt: '10px', mr: '5px', backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 구매 Url' type='url'
                    onChange={(event) => onProductUrlChangeHandler(event)} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Fab sx={{ position: 'fixed', bottom: '150px', right: '100px' }} onClick={() => onUpdateButtonHandler()}>
          <CreateIcon />
        </Fab>
      </Box>
    </Box>
  )
}