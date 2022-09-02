import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import CategoryDetailList from '../../product/CategoryDetailList/CategoryDetailList';
import CategoryProductListNav from '../../product/CategoryProductListNav/CategoryProductListNav';

function ProductListContent() {
  const { lgId, mdId } = useParams();
  const [title, setTitle] = useState();
  const [subTitle, setSubTitle] = useState();
  const [mediumCategoryList, setMediumCategoryList] = useState();
  const [datas, setDatas] = useState();
  const [pagination, setPagination] = useState(0);
  const [readMore, setReadMore] = useState(false);
  const [isWishChange, setIsWishChange] = useState(false);

  const onIntersect = ([{ isIntersecting }]) => {
    if (isIntersecting) {
      setPagination(pagination + 1);
      setReadMore(false);
    }
  };

  const { targetRef } = useIntersectionObserver({ onIntersect });

  const handleProductList = (lId = 1, mId = 0, sId = 0) => {
    let urlParams = '';
    if (Number(sId) !== 0) {
      urlParams = `/small/${sId}`;
    } else if (Number(mId) !== 0) {
      urlParams = `/medium/${mId}`;
    } else if (Number(mId) === 0) {
      urlParams = `/large/${lId}`;
    }

    let isUser = false;
    const token = localStorage.getItem('token');
    const headers = {
      headers: {
        Authorization: JSON.parse(token),
      },
    };
    const body = {
      page: pagination,
      size: 20,
    };

    if (token !== null) isUser = true;

    axios
      .get(
        `http://13.209.26.150:9000/${
          isUser ? 'users' : 'non-users'
        }/products${urlParams}`,
        body,
        headers,
      )
      .then((res) => {
        const respones = res.data.result;
        setDatas(respones);
        setReadMore(true);
      });

    // console.log(lgId, mdId);
    // console.log(
    //   `http://13.209.26.150:9000/${
    //     isUser ? 'users' : 'non-users'
    //   }/products${urlParams}`,
    //   headers,
    // );
  };

  useEffect(() => {
    axios
      .get(`http://13.209.26.150:9000/comm-users/category/${lgId}`)
      .then((res) => {
        const response = res.data.result;
        let mdName = '';
        if (Number(mdId) === 0) {
          mdName = '전체보기';
          setSubTitle('전체보기');
          handleProductList(lgId);
        } else {
          Object.values(response.mediumCategoryList).forEach((v) => {
            if (v.mediumCategoryId === Number(mdId)) {
              mdName = v.mediumCategoryTitle;
            }
          });
          handleProductList(lgId, mdId);
        }

        setTitle(response.largeCategoryTitle);
        setSubTitle(mdName);
        setMediumCategoryList(response.mediumCategoryList);
      });
  }, [lgId, mdId, isWishChange]);

  return (
    <>
      <CategoryProductListNav lgId={lgId} title={title} subTitle={subTitle} />
      <div id="m_content" className="react-area">
        {mediumCategoryList && (
          <CategoryDetailList
            mediumCategoryList={mediumCategoryList}
            datas={datas}
            handleProductList={handleProductList}
            isWishChange={isWishChange}
            setIsWishChange={setIsWishChange}
          />
        )}
      </div>
      {readMore && <div ref={targetRef}>Loading</div>}
    </>
  );
}

export default ProductListContent;
