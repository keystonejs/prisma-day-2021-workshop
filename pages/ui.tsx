import React from 'react'
import { Container, Divider } from '../components/ui/layout';
import { H1, H2, H3, H4, H5, H6 } from '../components/ui/typography';


export default function UIPage () {
  return (
    <Container>
      <H1>Heading 1</H1>
      <H2>Heading 2</H2>
      <H3>Heading 3</H3>
      <H4>Heading 4</H4>
      <H5>Heading 5</H5>
      <H6>Heading 6</H6>
      <Divider />
    </Container>
  );
}

