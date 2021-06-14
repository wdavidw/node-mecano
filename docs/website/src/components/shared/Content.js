// React
import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
// Material UI
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import EditIcon from '@material-ui/icons/EditOutlined'
import ListIcon from '@material-ui/icons/ListOutlined'
import Toc from "./Toc"

require('prismjs/themes/prism.css')

const useStyles = theme => ({
  content: theme.mixins.gutters({
    ...theme.typography.body1,
    paddingTop: theme.spacing(5),
    flex: '1 1 100%',
    maxWidth: '100%',
    margin: theme.spacing(0, 'auto', 5),
    lineHeight: '1.6rem',
    '& h1': {
      ...theme.typography.root,
      ...theme.typography.h1,
      ...theme.typography.gutterBottom,
      fontWeight: 'normal',
    },
    '& h2': {
      ...theme.typography.root,
      ...theme.typography.h2,
      ...theme.typography.gutterBottom,
      fontWeight: 'normal',
      marginTop: theme.spacing(4),
    },
    '& h3': {
      ...theme.typography.root,
      ...theme.typography.h3,
      ...theme.typography.gutterBottom,
      fontWeight: 'normal',
      marginTop: theme.spacing(3),
    },
    '& blockquote': {
      borderLeft: '3px solid #777777',
      margin: 0,
      paddingLeft: theme.spacing(5),
    },
    '& blockquote p': {
      color: '#777777',
    },
    '& blockquote p > code[class*="language-"]': {
      color: '#646464',
    },
    '& ul': {
      paddingLeft: theme.spacing(2),
    },
    '& :not(pre) > code': {
      padding: '.1em .3em',
      background: theme.code.main,
      color: '#000',
    },
    '& a': {
      textDecoration: 'none',
      '&:link,&:visited,& > code': {
        color: theme.link.main,
      },
      '&:hover,&:hover > code': {
        textDecoration: 'none',
        color: theme.link.light,
      },
    },
    '& .gatsby-highlight pre': {
      background: theme.code.main,  // Apply a better background color for code snippets
      // Remove ugly colors for characters like "=;:"
      '& .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string': {
        color: 'inherit',
        background: 'inherit',
      },
    },
    '& .gatsby-highlight-code-line': {
      background: 'rgba(255,255,255,.7)',
      display: 'block',
    },
    [theme.breakpoints.up(900 + theme.spacing(6))]: {
      maxWidth: 900,
    },
  }),
  tools: {
    float: 'right',
  },
  icons: {
    color: '#cccccc',
    '&:link,&:visited': {
      color: '#cccccc !important',
    },
    '&:hover': {
      textDecoration: 'none',
      color: theme.link.main + ' !important',
    }
  },
})

const Content = ({
  children,
  page
}) => {
  const styles = useStyles(useTheme())
  const [isOpen, setIsOpen] = useState(false)
  const onToggle = () => {
    setIsOpen(!isOpen)
  }
  return (
    <main css={styles.content}>
      { page && !page.home && (
        <Fragment>
          <div css={styles.tools}>
            {page.tableOfContents && page.tableOfContents.items && (
                <Tooltip id="content-toc" title="Toggle table of content">
                  <IconButton
                    color="inherit"
                    aria-labelledby="content-toc"
                    css={styles.icons}
                    onClick={onToggle}
                  >
                    <ListIcon />
                  </IconButton>
                </Tooltip>
            )}
            {page.edit_url && (
              <Tooltip id="content-edit" title="Edit on GitHub">
                <IconButton
                  color="inherit"
                  href={page.edit_url}
                  aria-labelledby="content-edit"
                  css={styles.icons}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
          <h1>{page.title}</h1>
          {page.tableOfContents && page.tableOfContents.items && (
            <Toc
              startLevel={1}
              isOpen={isOpen}
              items={page.tableOfContents.items}
            />
          )}
        </Fragment>
      )}
      {children}
    </main>
  )
}

Content.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Content
