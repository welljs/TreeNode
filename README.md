# TreeNode

Класс из коллекции объектов формирует дерево данных. Эти данные react-вьюха рендерит в один проход. 

Ниже вырезка из кода, который рисует древовидную структуру

```javascript

//CodesGrid.tsx

public render() {

//формируется дерево из items: IKbk[], исходная коллекция данных KbkDictionaries
const tree = new DataTree(KbkDictionaries, items)
      .build({key: 'parentId', ref: 'id'})
      .getState();


<LayoutScrolledContent className={css.formTableContainer}>
	<div className={css.formTable}>
	  {
	    tree.map((node: ITreeNodeState<TExtendedKbk, any>, i: number) => {
	      return (
	        <CodesGridItem
	          checkboxEnabled={(options as ICodesGridOptions).allowCheck}
	          contextMenuEnabled={(options as ICodesGridOptions).allowContextMenu}
	          onExpandClick={onExpandClick}
	          data={node.data}
	          children={node.children}
	          checked={node.data.checked}
	          expanded={node.data.expanded}
	          onCheck={onItemCheck}
	          onEditClick={onCodeEditClick}
	          onDeleteClick={onCodeDeleteClick}
	          onItemClick={onItemClick as (codeData: TExtendedKbk) => void}
	          key={i}
	          depth={0}
	        />
	      );
	    })
	  }
	</div>
</LayoutScrolledContent>

}



//CodesGridItem.tsx
public render() {
	const { data: {code, name}, children, depth, onEditClick, onDeleteClick, checked, onCheck, checkboxEnabled,
      contextMenuEnabled, onItemClick, expanded, onExpandClick } = this.props;
    const depthClass = depth >= 0 ? `${css[`depth-${depth}`]}` : '';
    return (
      <div className={css.container}>
        <div className={cn(css.tableRow, !expanded && css.tableRowCollapsed, !children.length && css.tableRowEmpty)}>
          {checkboxEnabled ? (
            <div className={css.checkboxArea}>
              <Checkbox
                id={'checkbox' + code}
                checked={checked}
                onChange={this.onCheck}
              />
            </div>) : null}
          <div className={cn(css.parent, css.embedded, depthClass)}>
            <div className={cn(css.namingArea, css.normal)} onClick={this.switchExpanded} onDoubleClick={this.onItemClick}>
              <div className={cn(css.collapseArrow)}>
                <Icon className={css.collapseArrowIcon} name="chevronDown" />
              </div>
              <div className={css.namingTitle}>{name}</div>
              <div className={css.namingDescription}>Статья расхода</div>
            </div>
            <CodeCell code={code} contextMenuEnabled={contextMenuEnabled} onEditClick={this.onEditClick} onDeleteClick={this.onDeleteClick}/>
          </div>
        </div>
        { !!children.length && expanded &&
          <div className={css.children}>
            {children.map((node: ITreeNodeState<TExtendedKbk, any>, i) => (
              <CodesGridItem
                className={cn(!expanded && css.tableRowCollapsed, !node.children.length && css.tableRowEmpty)}
                data={node.data}
                checkboxEnabled={checkboxEnabled}
                contextMenuEnabled={contextMenuEnabled}
                checked={node.data.checked}
                children={node.children}
                expanded={node.data.expanded}
                key={node.data.id}
                onDeleteClick={onDeleteClick}
                onEditClick={onEditClick}
                onItemClick={onItemClick}
                onExpandClick={onExpandClick}
                onCheck={onCheck}
                depth={depth + 1}
              />
            ))}
          </div>
        }
      </div>
    );
}

```
