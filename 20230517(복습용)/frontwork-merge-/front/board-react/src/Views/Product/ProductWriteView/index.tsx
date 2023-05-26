import { ChangeEvent, KeyboardEvent, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios, { AxiosResponse } from 'axios';

import { Box, Fab, Input, Divider, Typography, IconButton, Card } from '@mui/material'
import CreateIcon from '@mui/icons-material/Create';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

import { FILE_UPLOAD_URL, POST_PRODUCT_URL, authorizationHeader, mutipartHeader } from 'src/constants/api';
import { PostProductDto } from 'src/apis/request/board';
import { PostBoardResponseDto } from 'src/apis/response/board';
import ResponseDto from 'src/apis/response';
import { Product } from 'src/interfaces';
import { usePostProductStore } from 'src/stores';

export default function ProductWriteView() {
    // hook //
    const navigator = useNavigate();

    const productImgRef1 = useRef<HTMLInputElement | null>(null);
    const productImgRef2 = useRef<HTMLInputElement | null>(null);
    const productImgRef3 = useRef<HTMLInputElement | null>(null);
    const productImgRef4 = useRef<HTMLInputElement | null>(null);
    const productImgRef5 = useRef<HTMLInputElement | null>(null);
    const productImgRef6 = useRef<HTMLInputElement | null>(null);

    const [cookies] = useCookies();
    const { product1, product2, product3, product4, product5, product6 } = usePostProductStore();
    const { setProduct1, setProduct2, setProduct3, setProduct4, setProduct5, setProduct6 } = usePostProductStore();
    // const [product1, setProduct1] = useState<Product | null>(null);
    // const [product2, setProduct2] = useState<Product | null>(null);
    // const [product3, setProduct3] = useState<Product | null>(null);
    // const [product4, setProduct4] = useState<Product | null>(null);
    // const [product5, setProduct5] = useState<Product | null>(null);
    // const [product6, setProduct6] = useState<Product | null>(null);
    const [productImgUrl1, setProductImgUrl1] = useState<string>('');
    const [productImgUrl2, setProductImgUrl2] = useState<string>('');
    const [productImgUrl3, setProductImgUrl3] = useState<string>('');
    const [productImgUrl4, setProductImgUrl4] = useState<string>('');
    const [productImgUrl5, setProductImgUrl5] = useState<string>('');
    const [productImgUrl6, setProductImgUrl6] = useState<string>('');
    const [productName, setProductName] = useState<string>('');
    const [productPrice, setProductPrice] = useState<string>('');
    const [productUrl, setProductUrl] = useState<string>('');

    const accessToken = cookies.accessToken;

    // event handler //
    const onProductImageUploadButtonHandler1 = () => {
        if (!productImgRef1.current) return;
        productImgRef1.current.click();
    }
    const onProductImageUploadButtonHandler2 = () => {
        if (!productImgRef2.current) return;
        productImgRef2.current.click();
    }
    const onProductImageUploadButtonHandler3 = () => {
        if (!productImgRef3.current) return;
        productImgRef3.current.click();
    }
    const onProductImageUploadButtonHandler4 = () => {
        if (!productImgRef4.current) return;
        productImgRef4.current.click();
    }
    const onProductImageUploadButtonHandler5 = () => {
        if (!productImgRef5.current) return;
        productImgRef5.current.click();
    }
    const onProductImageUploadButtonHandler6 = () => {
        if (!productImgRef6.current) return;
        productImgRef6.current.click();
    }

    const onProductImageUploadChangeHandler1 = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const data = new FormData();
        data.append('file', event.target.files[0]);
        axios.post(FILE_UPLOAD_URL, data, mutipartHeader())
            .then((response) => productImageUploadResponseHandler1(response))
            .catch((error) => productImageUploadErrorHandler(error))
    }
    const onProductImageUploadChangeHandler2 = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const data = new FormData();
        data.append('file', event.target.files[0]);
        axios.post(FILE_UPLOAD_URL, data, mutipartHeader())
            .then((response) => productImageUploadResponseHandler2(response))
            .catch((error) => productImageUploadErrorHandler(error))
    }
    const onProductImageUploadChangeHandler3 = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const data = new FormData();
        data.append('file', event.target.files[0]);
        axios.post(FILE_UPLOAD_URL, data, mutipartHeader())
            .then((response) => productImageUploadResponseHandler3(response))
            .catch((error) => productImageUploadErrorHandler(error))
    }
    const onProductImageUploadChangeHandler4 = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const data = new FormData();
        data.append('file', event.target.files[0]);
        axios.post(FILE_UPLOAD_URL, data, mutipartHeader())
            .then((response) => productImageUploadResponseHandler4(response))
            .catch((error) => productImageUploadErrorHandler(error))
    }
    const onProductImageUploadChangeHandler5 = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const data = new FormData();
        data.append('file', event.target.files[0]);
        axios.post(FILE_UPLOAD_URL, data, mutipartHeader())
            .then((response) => productImageUploadResponseHandler5(response))
            .catch((error) => productImageUploadErrorHandler(error))
    }
    const onProductImageUploadChangeHandler6 = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const data = new FormData();
        data.append('file', event.target.files[0]);
        axios.post(FILE_UPLOAD_URL, data, mutipartHeader())
            .then((response) => productImageUploadResponseHandler6(response))
            .catch((error) => productImageUploadErrorHandler(error))
    }

    const onProductNameChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const productName = event.target.value;
        if (product1) setProduct1({ ...product1, productName });
        else {
            const product: Product = {
                productName,
                productPrice: '',
                productUrl: '',
                productImgUrl: ''
            }
            setProduct1(product);
        }
    }
    const onProductPriceChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const productPrice = event.target.value;
        if (product1) setProduct1({ ...product1, productPrice });
        else {
            const product: Product = {
                productName: '',
                productPrice,
                productUrl: '',
                productImgUrl: ''
            }
            setProduct1(product);
        }
    }
    const onProductUrlChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const productUrl = event.target.value;
        if (product1) setProduct1({ ...product1, productUrl });
        else {
            const product: Product = {
                productName: '',
                productPrice: '',
                productUrl,
                productImgUrl: ''
            }
            setProduct1(product);
        }
    }

    const postProduct = () => {
        const data : PostProductDto = { productName, productPrice, productUrl, productImgUrl1, productImgUrl2, productImgUrl3, productImgUrl4, productImgUrl5, productImgUrl6 }
    }

    const onProductWriteHandler = () => {
        if (!product1 || !product2 || !product3) {
            alert('3가지는 입력하세요.');
            return;
        }
        // navigator('/post-product');
        postProduct();
    }


    // response handler //
    const productImageUploadResponseHandler1 = (response: AxiosResponse<any, any>) => {
        const productImgUrl = response.data as string;
        if (!productImgUrl) return;
        if (product1) setProduct1({ ...product1, productImgUrl });
        else {
            const product: Product = {
                productName: '',
                productPrice: '',
                productUrl: '',
                productImgUrl
            }
            setProduct1(product);
        }
        // setProductImgUrl1(productImgUrl);
    }
    const productImageUploadResponseHandler2 = (response: AxiosResponse<any, any>) => {
        const productImgUrl = response.data as string;
        if (!productImgUrl) return;
        setProductImgUrl2(productImgUrl);
    }
    const productImageUploadResponseHandler3 = (response: AxiosResponse<any, any>) => {
        const productImgUrl = response.data as string;
        if (!productImgUrl) return;
        setProductImgUrl3(productImgUrl);
    }
    const productImageUploadResponseHandler4 = (response: AxiosResponse<any, any>) => {
        const productImgUrl = response.data as string;
        if (!productImgUrl) return;
        setProductImgUrl4(productImgUrl);
    }
    const productImageUploadResponseHandler5 = (response: AxiosResponse<any, any>) => {
        const productImgUrl = response.data as string;
        if (!productImgUrl) return;
        setProductImgUrl5(productImgUrl);
    }
    const productImageUploadResponseHandler6 = (response: AxiosResponse<any, any>) => {
        const productImgUrl = response.data as string;
        if (!productImgUrl) return;
        setProductImgUrl6(productImgUrl);
    }

    const postProductResponseHandler = (response: AxiosResponse<any, any>) => {
        const { result, message, data } = response.data as ResponseDto<PostBoardResponseDto>
        if (!result || !data) {
            alert(message);
            return;
        }
        navigator('/');
    }

    // error handler //
    const productImageUploadErrorHandler = (error: any) => {
        console.log(error.message);
    }

    // use effect //
    useEffect(() => {
        if (!accessToken) {
            navigator('/')
            return;
        }
    }, [])

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: '100px', pl: '450px', width: '1000px' }}>
                {/* //? 상품 업로드 박스 */}
                <Box >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        {/* //? 상품 등록박스1 */}
                        <Box sx={{ p: '15PX 15px', width: '235px', height: '285px', border: 0.3, borderRadius: 1 }}>
                            <Box sx={{ display: 'flex' }}>
                                <Box sx={{ p: '15px 0' }}>
                                    <Box sx={{ width: '100%' }} >
                                        <Box sx={{ width: '100%' }} component='img' src={product1?.productImgUrl} />
                                    </Box>
                                </Box>
                                <Box sx={{}}>
                                    <IconButton onClick={() => onProductImageUploadButtonHandler1()} >
                                        <AddAPhotoIcon />
                                        <input ref={productImgRef1} hidden type='file' accept='image/*' onChange={(event) => onProductImageUploadChangeHandler1(event)} />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box sx={{ ml: '5px', mt: '15px' }}>
                                <Input sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 이름'
                                    onChange={(event) => onProductNameChangeHandler(event)} value={product1?.productName} />
                                <Input sx={{ mt: '10px', backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 가격'
                                    onChange={(event) => onProductPriceChangeHandler(event)} value={product1?.productPrice} />
                                {/* //? url 이동 되는건가? */}
                                <Input sx={{ mt: '10px', mr: '5px', backgroundColor: 'rgba(0, 0, 0, 0.02)', width: '225px' }} disableUnderline placeholder='상품 구매 Url' type='url'
                                    onChange={(event) => onProductUrlChangeHandler(event)} value={product1?.productUrl} />
                            </Box>
                        </Box >
                        {/* //? 상품 등록박스2 */}
                        <Box sx={{ p: '15PX 15px', width: '235px', height: '285px', border: 0.3, borderRadius: 1 }}>
                            <Box sx={{ display: 'flex' }}>
                                <Box sx={{ p: '15px 0' }}>
                                    <Box sx={{ width: '100%' }} >
                                        <Box sx={{ width: '100%' }} component='img' src={productImgUrl2} />
                                    </Box>
                                </Box>
                                <Box sx={{}}>
                                    <IconButton onClick={() => onProductImageUploadButtonHandler2()} >
                                        <AddAPhotoIcon />
                                        <input ref={productImgRef2} hidden type='file' accept='image/*' onChange={(event) => onProductImageUploadChangeHandler2(event)} />
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
                                        <Box sx={{ width: '100%' }} component='img' src={productImgUrl3} />
                                    </Box>
                                </Box>
                                <Box sx={{}}>
                                    <IconButton onClick={() => onProductImageUploadButtonHandler3()} >
                                        <AddAPhotoIcon />
                                        <input ref={productImgRef3} hidden type='file' accept='image/*' onChange={(event) => onProductImageUploadChangeHandler3(event)} />
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
                                        <Box sx={{ width: '100%' }} component='img' src={productImgUrl4} />
                                    </Box>
                                </Box>
                                <Box sx={{}}>
                                    <IconButton onClick={() => onProductImageUploadButtonHandler4()} >
                                        <AddAPhotoIcon />
                                        <input ref={productImgRef4} hidden type='file' accept='image/*' onChange={(event) => onProductImageUploadChangeHandler4(event)} />
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
                                        <Box sx={{ width: '100%' }} component='img' src={productImgUrl5} />
                                    </Box>
                                </Box>
                                <Box sx={{}}>
                                    <IconButton onClick={() => onProductImageUploadButtonHandler5()} >
                                        <AddAPhotoIcon />
                                        <input ref={productImgRef5} hidden type='file' accept='image/*' onChange={(event) => onProductImageUploadChangeHandler5(event)} />
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
                                        <Box sx={{ width: '100%' }} component='img' src={productImgUrl6} />
                                    </Box>
                                </Box>
                                <Box sx={{}}>
                                    <IconButton onClick={() => onProductImageUploadButtonHandler6()} >
                                        <AddAPhotoIcon />
                                        <input ref={productImgRef6} hidden type='file' accept='image/*' onChange={(event) => onProductImageUploadChangeHandler6(event)} />
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

            <Fab sx={{ position: 'fixed', bottom: '50px', right: '100px' }} onClick={() => navigator('/post-product')}>
                <CreateIcon />
            </Fab>
        </>
    )
 
}
