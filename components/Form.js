import React from 'react';
import { connect } from 'react-redux';
import ReactTable from "react-table";
import 'react-table/react-table.css'

class Form extends React.Component {

    displayData (){

    	if ( !this.props.article.articleData ){
    		return [{
    			title: '-',
    			url : '-',
    			author: '-',
    			year: '-',
    			excerpt: '-'
    		}];
    	}

    	return [ this.props.article.articleData ];

    }

	render() {
		
		const columns = [{
				Header: 'Title',
				accessor: 'title',
				width: 400
			},
			{
				Header: 'URL',
				accessor: 'url',
			},
			{
				Header: 'Author',
				accessor: 'author',
			},
			{
				Header: 'Year',
				accessor: 'year',
				width: 70
			}
		];	

		return (
			<div>
			<link rel="stylesheet" href="https://unpkg.com/react-table@latest/react-table.css" />

			<h2>Visual Scholar</h2>
			
			 <ReactTable
			 	showPageSizeOptions = {false}
			 	showPagination={false}
			 	defaultPageSize={1}
    			data={this.displayData()}
    			columns={columns}
  			/>

			</div>
		);
	}
}

function mapStateToProps( state ) {
	const length = state.article.length
	const currentState = state.article[length - 1]  
	return { article: currentState }  
}

export default connect(mapStateToProps)(Form);
