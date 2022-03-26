import React, { useState } from 'react';
import { Select, Typography, Row, Col, Avatar, Card} from 'antd';
import moment from 'moment';

import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';
import { useGetCryptosQuery } from '../services/cryptoApi';
import Loader from './Loader';

const { Text, Title } = Typography;
const { Option } = Select;

const demoImage = 'http://coinrevolution.com/wp-content/uploads/2020/06/cryptonews.jpg';

const News = ({ simplified }) => {

    const [newsCategory, setNewsCategory] = useState('Cryptocurrency');

    const count = simplified ? 6 : 15;
    const { data: cryptoNews, isFetching } = useGetCryptoNewsQuery({ newsCategory, count });
    const { data } = useGetCryptosQuery(100);
    console.log(cryptoNews);

    if(isFetching) return <Loader />;
  return (
    <Row gutter={[ 24, 24 ]}>
        {
            !simplified && 
            <Col span={24}>
                <Select
                    showSearch
                    className='select-news'
                    placeholder='Select a crypto'
                    optionFilterProp='children'
                    onChange={(value) => setNewsCategory(value)}
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) > 0 }
                >
                    <Option value='Cryptocurrency'>
                        Cryptocurrency
                    </Option>
                    {
                        data?.data?.coins.map((coin, i) => (
                            <Option value={coin.name} key={i}>
                                {coin.name}
                            </Option>
                        ))
                    }
                </Select>
            </Col>
        }
        {
            cryptoNews?.value.map((news, i) => (
                <Col xs={24} sm={12} lg={8} key={i}>
                    <Card hoverable className='news-card'>
                        <a href={news.url} target="_blank" rel="noreferrer">
                            <div className='news-image-container'>
                                <Title className='news-title' level={4}>
                                    {news.name}
                                </Title>
                                <img style={{maxWidth: '150px', maxHeight: '100px' }} src={news?.image?.thumbnail?.contentUrl || demoImage } alt={news.name}/>
                            </div>
                            <p>
                                {news.description > 100 ? `${news.description.subString(0, 100)}...` : news.description}
                            </p>
                            <div className='provider-container'>
                                <div>
                                    <Avatar src={news.provider[0]?.image?.thumbnail?.contentUrl || demoImage} alt='' />
                                    <Text className='provider-name'>
                                        {news.provider[0]?.name}
                                    </Text>
                                </div>

                                <Text>
                                    {moment(news.datePublished).startOf('ss').fromNow()}
                                </Text>
                            </div>
                        </a>
                    </Card>
                </Col>
            ))
        }
    </Row>
  )
}

export default News