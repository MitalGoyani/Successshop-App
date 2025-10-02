import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import { colors } from '../constants/colors';

function CartBack(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="91.000000pt"
      height="101.000000pt"
      viewBox="0 0 91.000000 101.000000"
      fill={colors.primary}
      {...props}
    >
      <Path
        d="M340 962C153 864 66 804 35 755L5 707V506C5 229-3 243 263 90 430-5 461-10 570 48c187 98 274 158 305 207l30 48v201c0 277 8 263-258 416-167 95-198 100-307 42z"
        transform="matrix(.1 0 0 -.1 0 101)"
      />
    </Svg>
  )
}

export default CartBack
