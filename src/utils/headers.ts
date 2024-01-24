export const getAccessTokenFromHeader = ({
  authorization
}: {
  authorization?: string
}) => ({ accessToken: authorization?.split(' ')[1] })
