package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.BoardHasProductEntity;
import com.example.demo.entity.primaryKey.BoardHasProductPK;

@Repository
public interface BoardHasProductRepository extends JpaRepository<BoardHasProductEntity, BoardHasProductPK>{
    public List<BoardHasProductEntity> findByBoardNumber(int boardNumber);

    public BoardHasProductEntity findByProductNumber(int productNumber);

    @Transactional
    public void deleteByBoardNumber(int boardNumber);
}
