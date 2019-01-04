import styled from "styled-components"

export const Container = styled.div`
  text-align: left;
  max-width: 900px;
  padding: 20px;
  margin: 0 auto;
  position: relative;
`

interface JobModalProps {
  color: string
}

export const JobModal = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  margin: 0 auto;
  background-color: ${(p: JobModalProps) => p.color};
  color: white;
  font-size: 12px;
  padding: 2px 0;
`
