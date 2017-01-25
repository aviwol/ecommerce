import React, { Component } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/lib/fa';
import Loader from 'halogen/GridLoader';
import {
  Card,
  CardImg,
  CardText,
  CardLink,
  CardBlock,
  CardTitle,
  CardSubtitle,
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupButton,
  Input,
} from 'reactstrap';

const MAX_PRICE = '150';
const FREE_SHIPPING = true;


class App extends Component {
  constructor() {
    super();
    this.state = {
      searchQ: '',
      ebay: null,
      loading: false,
    };
    this.search = this.search.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);
    this.renderLoader = this.renderLoader.bind(this);
  }

  search() {
    this.setState({ ebay: null, loading: true });
    axios(`/api/search?item=${escape(this.state.searchQ)}&max_price=${MAX_PRICE}&free_shipping=${FREE_SHIPPING}`)
      .then(({ data }) => {
        this.setState({ ebay: data.ebay, loading: false });
        console.log(data);
      })
      .catch(error => console.log('ERROR', error));
  }

  renderEbayCards() {
    return this.state.ebay.items.map((item, i) => (
      <Col xs={3}>
        <Card style={{ marginBottom: 20 }}>
          <CardBlock>
            <img top height="20" src="/images/ebay-logo.png" alt="Ebay" />
          </CardBlock>
          <img top height="200" src={item.galleryURL} alt={item.title} style={{ objectFit: 'cover' }} />
          <CardBlock>
            <CardTitle>{item.title}</CardTitle>
            <CardSubtitle>{item.condition}</CardSubtitle>
            <CardLink href={item.viewItemURL} target="_blank">View Item</CardLink>
          </CardBlock>
        </Card>
      </Col>
    ));
  }

  handleEnterPress(e) {
    if (e.key === 'Enter') {
      this.search();
    }
  }

  renderLoader() {
    return this.state.loading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader color="#0275d8" size="16px" margin="4px"/>
      </div>
    ) : null;
  }

  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col xs={{ size: 8, offset: 2 }}>
              <InputGroup style={{ marginTop: 50, marginBottom: 50 }}>
                <Input
                  placeholder="What are you looking for?"
                  onChange={event => this.setState({ searchQ: event.target.value })}
                  onKeyPress={this.handleEnterPress}
                />
                <InputGroupButton>
                  <Button color="secondary" onClick={this.search}>
                    <FaSearch />
                  </Button>
                </InputGroupButton>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            {this.state.ebay ? this.renderEbayCards() : null}
          </Row>
        </Container>
        {this.renderLoader()}
      </div>
    );
  }
}

export default App;
