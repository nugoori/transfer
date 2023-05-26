package com.example.demo.service.implementation;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.common.constant.ResponseMessage;
import com.example.demo.dto.request.board.LikeDto;
import com.example.demo.dto.request.board.PatchBoardDto;
import com.example.demo.dto.request.board.PostBoardDto;
import com.example.demo.dto.request.board.PostBoardProduct;
import com.example.demo.dto.request.board.PostCommentDto;
import com.example.demo.dto.response.ResponseDto;
import com.example.demo.dto.response.board.DeleteBoardResponseDto;
import com.example.demo.dto.response.board.GetBoardResponseDto;
import com.example.demo.dto.response.board.GetListResponseDto;
import com.example.demo.dto.response.board.GetMyLikeListResponseDto;
import com.example.demo.dto.response.board.PostMyListResponseDto;
import com.example.demo.dto.response.board.GetSearchTagResponseDto;
import com.example.demo.dto.response.board.GetTop15SearchWordResponseDto;
import com.example.demo.dto.response.board.GetTop3ListResponseDto;
import com.example.demo.dto.response.board.LikeResponseDto;
import com.example.demo.dto.response.board.PatchBoardResponseDto;
import com.example.demo.dto.response.board.PostBoardResponseDto;
import com.example.demo.dto.response.board.PostCommentResponseDto;
import com.example.demo.entity.BoardEntity;
import com.example.demo.entity.BoardHasProductEntity;
import com.example.demo.entity.CommentEntity;
import com.example.demo.entity.LikyEntity;
import com.example.demo.entity.ProductEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.entity.resultSet.SearchWordResultSet;
import com.example.demo.repository.BoardHasProductRepository;
import com.example.demo.repository.BoardRepository;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.LikyRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.SearchWordLogRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.BoardService;

@Service
public class BoardServiceImplements implements BoardService {
    
    @Autowired 
    private UserRepository userRepository;
    
    @Autowired 
    private BoardRepository boardRepository;
    
    @Autowired 
    private ProductRepository productRepository;
    
    @Autowired 
    private CommentRepository commentRepository;
    
    @Autowired 
    private LikyRepository likyRepository;
    
    @Autowired 
    private BoardHasProductRepository boardHasProductRepository;
    
    @Autowired 
    private SearchWordLogRepository searchWordLogRepository;

    //? 게시물 작성하기
    public ResponseDto<PostBoardResponseDto> postBoard(String email, PostBoardDto dto) {
        PostBoardResponseDto data = null;

        // List<PostBoardProduct> productList = dto.getProductList();

        try {
            UserEntity userEntity = userRepository.findByEmail(email);
            if (userEntity == null) return ResponseDto.setFailed(ResponseMessage.NOT_EXIST_USER);
            
            BoardEntity boardEntity = new BoardEntity(userEntity, dto);
            boardRepository.save(boardEntity);

            // List<ProductEntity> productEntityList = new ArrayList<>();

            // for (PostBoardProduct postBoardProduct: productList) {
            //     ProductEntity productEntity = new ProductEntity(postBoardProduct);
            //     productEntityList.add(productEntity);
            // }

            // productRepository.saveAll(productEntityList);

            int boardNumber = boardEntity.getBoardNumber();

            List<CommentEntity> commentEntity = commentRepository.findByBoardNumberOrderByWriterDateDesc(boardNumber);
            List<LikyEntity> likyEntity = likyRepository.findByBoardNumber(boardNumber);


            // List<ProductEntity> productEntityList = null;
            
            // List<BoardHasProductEntity> boardHasProductEntity = boardHasProductRepository.findByBoardNumber(boardNumber);
            // for (BoardHasProductEntity number : boardHasProductEntity) {
            //     int productNumber = number.getBoardHasProductPk().getProductNumber();
            //     ProductEntity productEntity = productRepository.findById(productNumber) ;
            //     productEntityList.add(productEntity);
            // }

            data = new PostBoardResponseDto(boardEntity, commentEntity, likyEntity);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.setFailed(ResponseMessage.DATABASE_ERROR);
        }

        return ResponseDto.setSuccess(ResponseMessage.SUCCESS, data);
    }

    //? 게시물 리스트 가져오기
    public ResponseDto<List<GetListResponseDto>> getList() {
        List<GetListResponseDto> data = null;

        try{
            List<BoardEntity> boardEntityList = boardRepository.findByOrderByBoardWriteTimeDesc();
            data = GetListResponseDto.copyList(boardEntityList);

        }catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.setFailed(ResponseMessage.DATABASE_ERROR);
        }
        return ResponseDto.setSuccess(ResponseMessage.SUCCESS, data);
    }

    //? 자신이 작성한 게시물 가져오기
    public ResponseDto<List<PostMyListResponseDto>> getMyList(String email) {
        List<PostMyListResponseDto> data = null;

        try {
            List<BoardEntity> boardList = boardRepository.findByWriterEmailOrderByBoardWriteTimeDesc(email);
            data = PostMyListResponseDto.copyList(boardList);
        }catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.setFailed(ResponseMessage.DATABASE_ERROR);
        }
        return ResponseDto.setSuccess(ResponseMessage.SUCCESS, data);
    }

    //? 작성된 계시물 수정하기
    public ResponseDto<PatchBoardResponseDto> patchBoard(String email, PatchBoardDto dto) {
        PatchBoardResponseDto data = null;

        int boardNumber = dto.getBoardNumber();
        
        try {
            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if (boardEntity == null) return ResponseDto.setFailed(ResponseMessage.NOT_EXIST_BOARD);
            
            boolean isMatch = email.equals(boardEntity.getWriterEmail());
            if (!isMatch) return ResponseDto.setFailed(ResponseMessage.NOT_PERMISSION);

            List<CommentEntity> commentEntity = commentRepository.findByBoardNumberOrderByWriterDateDesc(boardNumber);
            List<LikyEntity> likyEntity = likyRepository.findByBoardNumber(boardNumber);

            boardEntity.patch(dto);
            boardRepository.save(boardEntity);

            data = new PatchBoardResponseDto(boardEntity, commentEntity, likyEntity);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.setFailed(ResponseMessage.DATABASE_ERROR);
        }

        return ResponseDto.setSuccess(ResponseMessage.SUCCESS, data);
    }

    //? 자신이 좋아요누른 게시물을 리스트 형태로 들고옴
    public ResponseDto<List<GetMyLikeListResponseDto>> myLikeList(String email) {
        List<GetMyLikeListResponseDto> data = new ArrayList<>();
        GetMyLikeListResponseDto getMyLikeListResponseDto = null;
        
        List<LikyEntity> likyEntityList = new ArrayList<>();
        
        try {
            UserEntity userEntity = userRepository.findByEmail(email);
            if (userEntity == null) return ResponseDto.setFailed(ResponseMessage.NOT_EXIST_USER);

            likyEntityList = likyRepository.findByUserEmail(email);

            for (LikyEntity liky: likyEntityList) {
                int boardNumber = liky.getBoardNumber();
                BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);

                String boardEntityImgUrl1 = boardEntity.getBoardImgUrl1();
                getMyLikeListResponseDto = new GetMyLikeListResponseDto(boardNumber, boardEntityImgUrl1);

                data.add(getMyLikeListResponseDto);
            }


        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.setFailed(ResponseMessage.DATABASE_ERROR);
        }

        return ResponseDto.setSuccess(ResponseMessage.SUCCESS, data);
    }
    
    //? 검색기능
    public ResponseDto<List<GetSearchTagResponseDto>> searchTag(String tag) {
        List<GetSearchTagResponseDto> data = new ArrayList<>();
        GetSearchTagResponseDto getSearchTagResponseDto = null;

        try {
            List<BoardEntity> boardEntityList = boardRepository.findByTag(tag);

            for(BoardEntity boardEntity: boardEntityList) {
                int boardNumber = boardEntity.getBoardNumber();
                String boardImgUrl1 = boardEntity.getBoardImgUrl1();
                getSearchTagResponseDto = new GetSearchTagResponseDto(boardNumber, boardImgUrl1);
                data.add(getSearchTagResponseDto);
            }

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.setFailed(ResponseMessage.DATABASE_ERROR);
        }

        return ResponseDto.setSuccess(ResponseMessage.SUCCESS, data);
    }

    //? 인기 게시물 3개
    public ResponseDto<List<GetTop3ListResponseDto>> getTop3List() {
        
        List<GetTop3ListResponseDto> data = null;
        Date aWeekAgoDate = Date.from(Instant.now().minus(7, ChronoUnit.DAYS));
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String aWeekAgo = simpleDateFormat.format(aWeekAgoDate);
    
        try {
            List<BoardEntity> boardList = boardRepository.findTop3ByBoardWriteTimeGreaterThanOrderByLikeCountDesc(aWeekAgo);
            data = GetTop3ListResponseDto.copyList(boardList);
    
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.setFailed(ResponseMessage.DATABASE_ERROR);
        }
    
        return ResponseDto.setSuccess(ResponseMessage.SUCCESS, data);
    
    }

    //? 인기 검색어
    public ResponseDto<GetTop15SearchWordResponseDto> getTop15SearchWord() {
        GetTop15SearchWordResponseDto data = null;
    
        try {
            List<SearchWordResultSet> searchWordList = searchWordLogRepository.findTop15();
            data = GetTop15SearchWordResponseDto.copyList(searchWordList);
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.setFailed(ResponseMessage.DATABASE_ERROR);
        }
    
        return ResponseDto.setSuccess(ResponseMessage.SUCCESS, data);
    }

    //? 특정 게시물 가져오기
    public ResponseDto<GetBoardResponseDto> getBoard(int boardNumber) {

        GetBoardResponseDto data = null;

        try {

            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if (boardEntity == null) return ResponseDto.setFailed(ResponseMessage.NOT_EXIST_BOARD);
            List<LikyEntity> likyList = likyRepository.findByBoardNumber(boardNumber);
            List<CommentEntity> commentList = commentRepository.findByBoardNumberOrderByWriterDateDesc(boardNumber);
            List<BoardHasProductEntity> boardHasProductList = boardHasProductRepository.findByBoardNumber(boardNumber);
            List<ProductEntity> productList = new ArrayList<>();

            for (BoardHasProductEntity boardHasProductEntity : boardHasProductList) {
                int productNumber = boardHasProductEntity.getProductNumber();
                ProductEntity productEntity = productRepository.findById(productNumber);
                productList.add(productEntity);
            }
            
            boardEntity.getViewCount();
            boardRepository.save(boardEntity);

            data = new GetBoardResponseDto(boardEntity, commentList, likyList, productList);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.setFailed(ResponseMessage.DATABASE_ERROR);
        }

        return ResponseDto.setSuccess(ResponseMessage.SUCCESS, data);

    }

    public ResponseDto<DeleteBoardResponseDto> deleteBoard(String email, int boardNumber) {
        DeleteBoardResponseDto data = null; 

        try {
            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if (boardEntity == null) return ResponseDto.setFailed(ResponseMessage.NOT_EXIST_BOARD);

            boolean isEqualWriter = email.equals(boardEntity.getWriterEmail());
            if (!isEqualWriter) return ResponseDto.setFailed(ResponseMessage.NOT_PERMISSION);

            List<BoardHasProductEntity> boardHasProductEntityList = boardHasProductRepository.findByBoardNumber(boardNumber);
            for (BoardHasProductEntity boardHasProductEntity: boardHasProductEntityList) {  
                boardHasProductRepository.deleteByBoardNumber(boardHasProductEntity.getBoardNumber());
                productRepository.deleteByProductNumber(boardHasProductEntity.getProductNumber());
            }

            commentRepository.deleteByBoardNumber(boardNumber);
            likyRepository.deleteByBoardNumber(boardNumber);

            boardRepository.delete(boardEntity);
            data = new DeleteBoardResponseDto(true);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.setFailed(ResponseMessage.DATABASE_ERROR);
        }
        return ResponseDto.setSuccess(ResponseMessage.SUCCESS, data);
    }

    public ResponseDto<PostCommentResponseDto> postComment(String email, PostCommentDto dto) {
       
        PostCommentResponseDto data = null;

        int boardNumber = dto.getBoardNumber();

        try {
            UserEntity userEntity = userRepository.findByEmail(email);
            if (userEntity == null) return ResponseDto.setFailed(ResponseMessage.NOT_EXIST_USER);

            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if (boardEntity == null) return ResponseDto.setFailed(ResponseMessage.NOT_EXIST_BOARD);

            CommentEntity commentEntity = new CommentEntity(userEntity, dto);
            commentRepository.save(commentEntity);

            boardEntity.increaseCommentCount();
            boardRepository.save(boardEntity);

            List<CommentEntity> commentList = commentRepository.findByBoardNumber(boardNumber);
            List<LikyEntity> likeList = likyRepository.findByBoardNumber(boardNumber);

            data = new PostCommentResponseDto(boardEntity, likeList, commentList);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.setFailed(ResponseMessage.DATABASE_ERROR);
        }
        return ResponseDto.setSuccess(ResponseMessage.SUCCESS, data);
    }

    @Override
    public ResponseDto<LikeResponseDto> like(String email, LikeDto dto) {

        LikeResponseDto data = null;

        int boardNumber = dto.getBoardNumber();

        try {
            UserEntity userEntity = userRepository.findByEmail(email);
            if (userEntity == null) return ResponseDto.setFailed(ResponseMessage.NOT_EXIST_USER);

            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if (boardEntity == null) return ResponseDto.setFailed(ResponseMessage.NOT_EXIST_BOARD);

            LikyEntity likyEntity = likyRepository.findByUserEmailAndBoardNumber(email, boardNumber);
            if (likyEntity == null) {
                likyEntity = new LikyEntity(userEntity, boardNumber);
                likyRepository.save(likyEntity);
                boardEntity.increaseLikeCount();
            } else {
                likyRepository.delete(likyEntity);
                boardEntity.decreaseLikeCount();
            }
            boardRepository.save(boardEntity);

            List<CommentEntity> commentList = commentRepository.findByBoardNumber(boardNumber);
            List<LikyEntity> likeList = likyRepository.findByBoardNumber(boardNumber);

            data = new LikeResponseDto(boardEntity, likeList, commentList);

        } 
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.setFailed(ResponseMessage.DATABASE_ERROR);
        }
        return ResponseDto.setSuccess(ResponseMessage.SUCCESS, data);
    }

}   
