import styled from 'styled-components'

export const ContainerMessage = styled.div`
  display: flex;
  overflow-x: hidden;
  flex-direction: column;
  flex: none;
  white-space: pre;
  word-wrap: break-word;
`

export const DefaultIntroImage = styled.img`
  max-height: 50%;
  width: 100%;
`

export const ContainerScrollButton = styled.div`
  position: absolute;
  right: 10px;
  bottom: 65px;

  background-color: #6d6a78;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 37px;
  height: 37px;
  border-radius: 50%;
`

export const ContainerUnreadMessagesBanner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  border-top: 1px solid #e8e8ea;
  padding: 8px;
  color: #6d6a78;
  font-size: 14px;
  font-weight: 400;
  width: 100%;

  img {
    width: 10px;
  }
`
